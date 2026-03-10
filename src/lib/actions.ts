"use server";

import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { authOptions } from "./auth";
import type { Product, Category } from "@/src/types/product";
import type { AdminStats, AdminUser } from "@/src/types/admin";
import type {
  StatData,
  TopMenuItem,
  QueueOrder,
  DailyReport,
  ReportOrder,
} from "@/src/types/penjual";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<ActionResult> {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Email sudah terdaftar." };

  const hashed = await bcrypt.hash(password, 12);
  await db.user.create({ data: { name, email, password: hashed } });

  return { ok: true };
}

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export async function placeOrder(
  userId: string,
  timeSlot: string,
  items: OrderItemInput[],
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const order = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Pengguna tidak ditemukan.");

      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) throw new Error("Produk tidak ditemukan.");
        if (!product.available) throw new Error(`${product.name} sedang tidak tersedia.`);
      }

      const serverTotal = items.reduce((sum, item) => {
        const p = productMap.get(item.productId)!;
        return sum + p.price * item.quantity;
      }, 0);

      if (user.balance < serverTotal) throw new Error("Saldo tidak mencukupi.");

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: serverTotal } },
      });

      return tx.order.create({
        data: {
          userId,
          timeSlot,
          total: serverTotal,
          status: "PREPARING",
          items: {
            create: items.map((item) => {
              const p = productMap.get(item.productId)!;
              return { productId: p.id, name: p.name, price: p.price, quantity: item.quantity };
            }),
          },
        },
      });
    });

    return { ok: true, data: { orderId: order.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { ok: false, error: message };
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<ActionResult<AdminStats>> {
  try {
    const [totalUsers, totalPenjual, totalOrders] = await Promise.all([
      db.user.count({ where: { role: "USER" } }),
      db.user.count({ where: { role: "PENJUAL" } }),
      db.order.count(),
    ]);
    return { ok: true, data: { totalUsers, totalPenjual, totalOrders } };
  } catch {
    return { ok: false, error: "Gagal memuat statistik." };
  }
}

export async function listAllUsers(): Promise<ActionResult<AdminUser[]>> {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });

    const mapped: AdminUser[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as AdminUser["role"],
      balance: u.balance,
      createdAt: u.createdAt,
      orderCount: u._count.orders,
    }));

    return { ok: true, data: mapped };
  } catch {
    return { ok: false, error: "Gagal memuat daftar pengguna." };
  }
}

export async function createPenjualAccount(
  name: string,
  email: string,
  password: string,
): Promise<ActionResult> {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Email sudah terdaftar." };

  const hashed = await bcrypt.hash(password, 12);
  await db.user.create({ data: { name, email, password: hashed, role: "PENJUAL" } });
  return { ok: true };
}

export async function updateUserById(
  id: string,
  data: { name?: string; email?: string; balance?: number },
): Promise<ActionResult> {
  try {
    if (data.email) {
      const conflict = await db.user.findFirst({ where: { email: data.email, NOT: { id } } });
      if (conflict) return { ok: false, error: "Email sudah digunakan akun lain." };
    }
    await db.user.update({ where: { id }, data });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal memperbarui akun." };
  }
}

export async function deleteUserById(id: string): Promise<ActionResult> {
  try {
    const target = await db.user.findUnique({ where: { id } });
    if (!target) return { ok: false, error: "Akun tidak ditemukan." };
    if (target.role === "ADMIN") return { ok: false, error: "Tidak dapat menghapus akun admin." };

    if (target.role === "PENJUAL") {
      const productCount = await db.product.count({ where: { sellerId: id } });
      if (productCount > 0) {
        return {
          ok: false,
          error: `Penjual masih memiliki ${productCount} produk. Hapus semua produk terlebih dahulu.`,
        };
      }
    }

    await db.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus akun." };
  }
}

// ─── Penjual ───────────────────────────────────────────────────────────────────

/** Count of PREPARING orders that contain at least one of this seller's products. */
export async function getPendingOrderCount(sellerId: string): Promise<number> {
  try {
    return await db.order.count({
      where: {
        status: "PREPARING",
        items: { some: { product: { sellerId } } },
      },
    });
  } catch {
    return 0;
  }
}

/** Today's revenue, order count, and unique active customers — scoped to this seller's products. */
export async function getPenjualStats(sellerId: string): Promise<StatData[]> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const itemFilter = (dateFilter: object) => ({
      product: { sellerId },
      order: { ...dateFilter, status: { not: "CANCELLED" as const } },
    });

    const [todayItems, yesterdayItems] = await Promise.all([
      db.orderItem.findMany({
        where: itemFilter({ createdAt: { gte: todayStart } }),
        select: { quantity: true, price: true, orderId: true, order: { select: { userId: true } } },
      }),
      db.orderItem.findMany({
        where: itemFilter({ createdAt: { gte: yesterdayStart, lt: todayStart } }),
        select: { quantity: true, price: true },
      }),
    ]);

    const todayRevenue     = todayItems.reduce((s, i) => s + i.quantity * i.price, 0);
    const yesterdayRevenue = yesterdayItems.reduce((s, i) => s + i.quantity * i.price, 0);
    const todayCount       = new Set(todayItems.map((i) => i.orderId)).size;
    const activeCustomers  = new Set(todayItems.map((i) => i.order.userId)).size;

    const revDiff = yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : null;

    const formatRupiah = (n: number) => {
      if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(".", ",")} Jt`;
      if (n >= 1_000)     return `Rp ${Math.round(n / 1_000)} Rb`;
      return `Rp ${n}`;
    };

    return [
      {
        label: "Total Pendapatan",
        value: formatRupiah(todayRevenue),
        iconColor: "text-green-600",
        iconBg: "bg-green-50",
        trend: revDiff !== null
          ? { label: `${revDiff >= 0 ? "+" : ""}${revDiff}% dari kemarin`, positive: revDiff >= 0 }
          : undefined,
      },
      {
        label: "Total Pesanan",
        value: String(todayCount),
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        label: "Pelanggan Aktif",
        value: String(activeCustomers),
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
    ];
  } catch {
    return [
      { label: "Total Pendapatan", value: "—", iconColor: "text-green-600",  iconBg: "bg-green-50" },
      { label: "Total Pesanan",    value: "—", iconColor: "text-blue-600",   iconBg: "bg-blue-50" },
      { label: "Pelanggan Aktif",  value: "—", iconColor: "text-purple-600", iconBg: "bg-purple-50" },
    ];
  }
}

/** Active queue orders (PREPARING/READY) that contain this seller's products. */
export async function getPenjualQueueOrders(sellerId: string): Promise<QueueOrder[]> {
  try {
    const orders = await db.order.findMany({
      where: {
        status: { in: ["PREPARING", "READY"] },
        items: { some: { product: { sellerId } } },
      },
      include: {
        items: { where: { product: { sellerId } } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return orders.map((o) => ({
      id: o.id,
      customerName: o.user.name,
      slot: o.timeSlot as "break1" | "break2",
      status: o.status as "PREPARING" | "READY",
      items: o.items.map((i) => `${i.quantity}x ${i.name}`),
    }));
  } catch {
    return [];
  }
}

/** Mark a PREPARING order as READY. */
export async function markOrderReady(orderId: string): Promise<ActionResult> {
  try {
    await db.order.update({ where: { id: orderId }, data: { status: "READY" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal memperbarui status pesanan." };
  }
}

/** Mark a READY order as COMPLETED. */
export async function completeOrderById(orderId: string): Promise<ActionResult> {
  try {
    await db.order.update({ where: { id: orderId }, data: { status: "COMPLETED" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menyelesaikan pesanan." };
  }
}

/** Hourly order distribution for today (hours 07–15), scoped to this seller's products. */
export async function getHourlyOrderCounts(sellerId: string): Promise<{ labels: string[]; values: number[] }> {
  const HOUR_LABELS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: todayStart },
        status: { not: "CANCELLED" },
        items: { some: { product: { sellerId } } },
      },
      select: { createdAt: true },
    });

    const counts = new Array<number>(HOUR_LABELS.length).fill(0);
    for (const o of orders) {
      const h = o.createdAt.getHours();
      const idx = h - 7;
      if (idx >= 0 && idx < counts.length) counts[idx]++;
    }

    return { labels: HOUR_LABELS, values: counts };
  } catch {
    return { labels: HOUR_LABELS, values: new Array<number>(HOUR_LABELS.length).fill(0) };
  }
}

/** Top 3 most-sold products for this seller. */
export async function getTopMenuItems(sellerId: string): Promise<TopMenuItem[]> {
  try {
    const grouped = await db.orderItem.groupBy({
      by: ["productId"],
      where: { product: { sellerId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    });

    const productIds = grouped.map((g) => g.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { seller: { select: { name: true } } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    return grouped.flatMap((g) => {
      const row = productMap.get(g.productId);
      if (!row) return [];
      const { seller, ...product } = row;
      return [{ ...product, sellerName: seller.name, soldCount: g._sum.quantity ?? 0 }];
    });
  } catch {
    return [];
  }
}

/** Daily revenue and order count for this seller's products, aggregated by date. */
export async function getDailyReports(days: number, sellerId: string): Promise<DailyReport[]> {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    cutoff.setHours(0, 0, 0, 0);

    const items = await db.orderItem.findMany({
      where: {
        product: { sellerId },
        order: { createdAt: { gte: cutoff }, status: { not: "CANCELLED" } },
      },
      select: { quantity: true, price: true, orderId: true, order: { select: { createdAt: true } } },
    });

    const byDate = new Map<string, { orderIds: Set<string>; revenue: number }>();
    for (const item of items) {
      const date  = item.order.createdAt.toISOString().split("T")[0];
      const entry = byDate.get(date) ?? { orderIds: new Set(), revenue: 0 };
      entry.orderIds.add(item.orderId);
      entry.revenue += item.quantity * item.price;
      byDate.set(date, entry);
    }

    return Array.from(byDate.entries())
      .map(([date, data]) => ({ date, orders: data.orderIds.size, revenue: data.revenue }))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

/** Detailed order log for this seller's products. */
export async function getReportOrders(days: number, sellerId: string): Promise<ReportOrder[]> {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    cutoff.setHours(0, 0, 0, 0);

    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: cutoff },
        status: { not: "CANCELLED" },
        items: { some: { product: { sellerId } } },
      },
      include: {
        items: { where: { product: { sellerId } } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
      id: o.id,
      customerName: o.user.name,
      items: o.items.map((i) => `${i.quantity}x ${i.name}`),
      total: o.items.reduce((s, i) => s + i.quantity * i.price, 0),
      date: o.createdAt.toISOString().split("T")[0],
      slot: o.timeSlot as "break1" | "break2",
    }));
  } catch {
    return [];
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

/** All products belonging to this seller (including unavailable) — for penjual management. */
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: { sellerId },
      include: { seller: { select: { name: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return rows.map(({ seller, ...p }) => ({ ...p, sellerName: seller.name }));
  } catch {
    return [];
  }
}

/** Only available products across all sellers — for customer-facing pages. */
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: { available: true },
      include: { seller: { select: { name: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return rows.map(({ seller, ...p }) => ({ ...p, sellerName: seller.name }));
  } catch {
    return [];
  }
}

export async function createProduct(data: {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}): Promise<ActionResult<Product>> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PENJUAL") {
    return { ok: false, error: "Tidak diizinkan." };
  }

  try {
    const row = await db.product.create({
      data: { ...data, sellerId: session.user.id },
      include: { seller: { select: { name: true } } },
    });
    const { seller, ...product } = row;
    return { ok: true, data: { ...product, sellerName: seller.name } };
  } catch {
    return { ok: false, error: "Gagal menambah produk." };
  }
}

export async function updateProduct(
  id: string,
  data: { name?: string; price?: number; category?: string; imageUrl?: string; available?: boolean },
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PENJUAL") {
    return { ok: false, error: "Tidak diizinkan." };
  }

  try {
    const product = await db.product.findUnique({ where: { id }, select: { sellerId: true } });
    if (!product) return { ok: false, error: "Produk tidak ditemukan." };
    if (product.sellerId !== session.user.id) return { ok: false, error: "Produk bukan milik Anda." };

    await db.product.update({ where: { id }, data });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal memperbarui produk." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PENJUAL") {
    return { ok: false, error: "Tidak diizinkan." };
  }

  try {
    const product = await db.product.findUnique({ where: { id }, select: { sellerId: true } });
    if (!product) return { ok: false, error: "Produk tidak ditemukan." };
    if (product.sellerId !== session.user.id) return { ok: false, error: "Produk bukan milik Anda." };

    const orderCount = await db.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      return { ok: false, error: "Produk tidak dapat dihapus karena sudah memiliki riwayat pesanan." };
    }

    await db.product.delete({ where: { id } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus produk." };
  }
}

// ─── User notifications ───────────────────────────────────────────────────────

export interface ReadyOrder {
  id:       string;
  items:    string[];
  timeSlot: string;
}

/** Returns all READY orders belonging to the given user. */
export async function getReadyOrdersForUser(userId: string): Promise<ReadyOrder[]> {
  try {
    const orders = await db.order.findMany({
      where: { userId, status: "READY" },
      include: { items: { select: { quantity: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return orders.map((o) => ({
      id:       o.id,
      items:    o.items.map((i) => `${i.quantity}x ${i.name}`),
      timeSlot: o.timeSlot,
    }));
  } catch {
    return [];
  }
}

// ─── Top up ───────────────────────────────────────────────────────────────────

const TOPUP_MIN = 10_000;
const TOPUP_MAX = 10_000_000;

export async function topUpBalance(
  userId: string,
  amount: number,
): Promise<ActionResult<{ newBalance: number }>> {
  if (!Number.isInteger(amount) || amount < TOPUP_MIN || amount > TOPUP_MAX) {
    return { ok: false, error: "Nominal isi saldo tidak valid." };
  }

  try {
    const updated = await db.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
      select: { balance: true },
    });
    return { ok: true, data: { newBalance: updated.balance } };
  } catch {
    return { ok: false, error: "Gagal melakukan isi saldo. Coba lagi." };
  }
}

// ─── Cancel order ─────────────────────────────────────────────────────────────

/** Cancel a PREPARING order and refund the total back to the user's balance. */
export async function cancelOrder(orderId: string, userId: string): Promise<ActionResult> {
  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order)                    throw new Error("Pesanan tidak ditemukan.");
      if (order.userId !== userId)   throw new Error("Tidak diizinkan membatalkan pesanan ini.");
      if (order.status !== "PREPARING") throw new Error("Pesanan tidak dapat dibatalkan pada status ini.");

      await tx.user.update({ where: { id: userId }, data: { balance: { increment: order.total } } });
      await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membatalkan pesanan.";
    return { ok: false, error: msg };
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function listCategories(): Promise<ActionResult<Category[]>> {
  try {
    const rows = await db.category.findMany({ orderBy: { name: "asc" } });
    return { ok: true, data: rows };
  } catch {
    return { ok: false, error: "Gagal memuat kategori." };
  }
}

export async function createCategory(name: string): Promise<ActionResult<Category>> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Nama kategori wajib diisi." };

  try {
    const existing = await db.category.findUnique({ where: { name: trimmed } });
    if (existing) return { ok: false, error: "Kategori dengan nama ini sudah ada." };

    const category = await db.category.create({ data: { name: trimmed } });
    return { ok: true, data: category };
  } catch {
    return { ok: false, error: "Gagal membuat kategori." };
  }
}

export async function updateCategory(id: string, name: string): Promise<ActionResult<Category>> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Nama kategori wajib diisi." };

  try {
    const conflict = await db.category.findFirst({ where: { name: trimmed, NOT: { id } } });
    if (conflict) return { ok: false, error: "Kategori dengan nama ini sudah ada." };

    const category = await db.category.update({ where: { id }, data: { name: trimmed } });
    return { ok: true, data: category };
  } catch {
    return { ok: false, error: "Gagal memperbarui kategori." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const category = await db.category.findUnique({ where: { id }, select: { name: true } });
    if (!category) return { ok: false, error: "Kategori tidak ditemukan." };

    const productCount = await db.product.count({ where: { category: category.name } });
    if (productCount > 0) {
      return { ok: false, error: `Kategori masih digunakan oleh ${productCount} produk. Pindahkan atau hapus produk tersebut terlebih dahulu.` };
    }

    await db.category.delete({ where: { id } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus kategori." };
  }
}
