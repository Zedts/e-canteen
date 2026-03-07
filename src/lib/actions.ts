"use server";

import bcrypt from "bcryptjs";
import { db } from "./db";
import type { AdminStats, AdminUser } from "@/src/types/admin";

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
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export async function placeOrder(
  userId: string,
  timeSlot: string,
  items: OrderItemInput[],
  total: number,
): Promise<ActionResult<{ orderId: string }>> {
  try {
    const order = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user) throw new Error("Pengguna tidak ditemukan.");
      if (user.balance < total) throw new Error("Saldo tidak mencukupi.");

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: total } },
      });

      return tx.order.create({
        data: {
          userId,
          timeSlot,
          total,
          status: "PREPARING",
          items: { create: items },
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

    await db.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus akun." };
  }
}
