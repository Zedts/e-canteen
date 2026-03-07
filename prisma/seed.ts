// dotenv/config MUST be first import -- loads .env synchronously
import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient }  from "../src/generated/prisma/client";
import bcrypt            from "bcryptjs";

function buildDbConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set in .env");

  const url = new URL(raw);
  return {
    host:            url.hostname,
    port:            parseInt(url.port),
    user:            decodeURIComponent(url.username),
    password:        decodeURIComponent(url.password),
    database:        url.pathname.slice(1),
    connectionLimit: 5,
  };
}

function daysAgo(d: number, hour = 10, minute = 0): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  dt.setHours(hour, minute, 0, 0);
  return dt;
}

async function seed() {
  const adapter = new PrismaMariaDb(buildDbConfig());
  const prisma  = new PrismaClient({ adapter });

  console.log("Seeding database...");

  // Clear in dependency order: Orders cascade to OrderItems, then Products, then Users
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // --- Products ---

  const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11] = await Promise.all([
    prisma.product.create({ data: { name: "Classic Cheeseburger", price: 25000, category: "Makanan Utama", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Nasi Goreng Spesial",  price: 20000, category: "Makanan Utama", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Ayam Geprek",          price: 18000, category: "Makanan Utama", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Mie Goreng",           price: 15000, category: "Makanan Utama", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Pisang Goreng Crispy", price:  8000, category: "Cemilan",       rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Kentang Goreng",       price: 10000, category: "Cemilan",       rating: 4.4, imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Es Teh Manis",         price:  5000, category: "Minuman",       rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Iced Latte",           price: 15000, category: "Minuman",       rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Jus Alpukat Susu",     price: 12000, category: "Minuman",       rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop", available: false } }),
    prisma.product.create({ data: { name: "Salad Buah Segar",     price: 12000, category: "Menu Sehat",    rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop", available: true  } }),
    prisma.product.create({ data: { name: "Smoothie Hijau",       price: 15000, category: "Menu Sehat",    rating: 4.4, imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop", available: true  } }),
  ]);

  console.log("Products seeded: 11");

  // --- Users ---

  const [adminHash, penjualHash, userHash] = await Promise.all([
    bcrypt.hash("admin123",   12),
    bcrypt.hash("penjual123", 12),
    bcrypt.hash("user123",    12),
  ]);

  const [admin, penjual, budi, dewi, eko, sari, rizky] = await Promise.all([
    prisma.user.create({ data: { name: "Admin",          email: "admin@ecanteen.id",   password: adminHash,   role: "ADMIN",   balance:      0 } }),
    prisma.user.create({ data: { name: "Penjual Kantin", email: "penjual@ecanteen.id", password: penjualHash, role: "PENJUAL", balance:      0 } }),
    prisma.user.create({ data: { name: "Budi Santoso",  email: "budi@siswa.id",        password: userHash,    role: "USER",    balance: 150000 } }),
    prisma.user.create({ data: { name: "Dewi Rahayu",   email: "dewi@siswa.id",        password: userHash,    role: "USER",    balance: 200000 } }),
    prisma.user.create({ data: { name: "Eko Prasetyo",  email: "eko@siswa.id",         password: userHash,    role: "USER",    balance:  80000 } }),
    prisma.user.create({ data: { name: "Sari Indah",    email: "sari@siswa.id",        password: userHash,    role: "USER",    balance: 120000 } }),
    prisma.user.create({ data: { name: "Rizky Maulana", email: "rizky@siswa.id",       password: userHash,    role: "USER",    balance:  95000 } }),
  ]);

  void admin; void penjual;

  // --- Helper: create a completed order from real product refs ---

  type ProductRef = { id: string; name: string; price: number };

  async function completedOrder(
    userId:   string,
    items:    { product: ProductRef; qty: number }[],
    slot:     "break1" | "break2",
    createdAt: Date,
  ) {
    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    return prisma.order.create({
      data: {
        userId,
        timeSlot: slot,
        total,
        status: "COMPLETED",
        createdAt,
        items: {
          create: items.map((i) => ({
            productId: i.product.id,
            name:      i.product.name,
            price:     i.product.price,
            quantity:  i.qty,
          })),
        },
      },
    });
  }

  // --- Historical orders (past 30 days) ---

  await Promise.all([
    // Day 29
    completedOrder(budi.id,  [{ product: p1, qty: 1 }, { product: p7, qty: 2 }], "break1", daysAgo(29, 10,  5)),
    completedOrder(dewi.id,  [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo(29, 10,  8)),
    completedOrder(eko.id,   [{ product: p3, qty: 1 }, { product: p7, qty: 1 }], "break2", daysAgo(29, 12, 35)),
    // Day 28
    completedOrder(sari.id,  [{ product: p4, qty: 1 }, { product: p5, qty: 2 }], "break1", daysAgo(28, 10,  3)),
    completedOrder(rizky.id, [{ product: p1, qty: 1 }, { product: p8, qty: 1 }], "break2", daysAgo(28, 12, 40)),
    completedOrder(budi.id,  [{ product: p2, qty: 1 }, { product: p6, qty: 1 }], "break2", daysAgo(28, 12, 45)),
    // Day 27
    completedOrder(dewi.id,  [{ product: p1, qty: 2 }, { product: p7, qty: 1 }], "break1", daysAgo(27, 10,  2)),
    completedOrder(eko.id,   [{ product: p3, qty: 1 }, { product: p9, qty: 1 }], "break1", daysAgo(27, 10, 10)),
    completedOrder(sari.id,  [{ product: p10, qty: 1 }, { product: p11, qty: 1 }], "break2", daysAgo(27, 12, 50)),
    // Day 25
    completedOrder(budi.id,  [{ product: p1, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo(25, 10,  7)),
    completedOrder(rizky.id, [{ product: p2, qty: 1 }, { product: p7, qty: 2 }], "break1", daysAgo(25, 10, 15)),
    completedOrder(dewi.id,  [{ product: p3, qty: 1 }, { product: p8, qty: 1 }], "break2", daysAgo(25, 12, 33)),
    completedOrder(eko.id,   [{ product: p4, qty: 1 }, { product: p5, qty: 1 }], "break2", daysAgo(25, 12, 38)),
    // Day 22
    completedOrder(sari.id,  [{ product: p1, qty: 1 }, { product: p7, qty: 1 }], "break1", daysAgo(22, 10,  4)),
    completedOrder(budi.id,  [{ product: p3, qty: 1 }, { product: p6, qty: 2 }], "break1", daysAgo(22, 10,  9)),
    completedOrder(rizky.id, [{ product: p2, qty: 1 }, { product: p9, qty: 1 }], "break2", daysAgo(22, 12, 42)),
    // Day 20
    completedOrder(dewi.id,  [{ product: p1, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo(20, 10,  6)),
    completedOrder(eko.id,   [{ product: p3, qty: 2 }],                          "break2", daysAgo(20, 12, 30)),
    completedOrder(sari.id,  [{ product: p4, qty: 1 }, { product: p7, qty: 2 }], "break2", daysAgo(20, 12, 55)),
    // Day 16
    completedOrder(budi.id,  [{ product: p1, qty: 1 }, { product: p5, qty: 2 }], "break1", daysAgo(16, 10,  3)),
    completedOrder(rizky.id, [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo(16, 10, 12)),
    completedOrder(dewi.id,  [{ product: p10, qty: 1 }, { product: p11, qty: 1 }], "break2", daysAgo(16, 12, 35)),
    // Day 13
    completedOrder(eko.id,   [{ product: p3, qty: 1 }, { product: p7, qty: 1 }], "break1", daysAgo(13, 10,  5)),
    completedOrder(sari.id,  [{ product: p1, qty: 1 }, { product: p6, qty: 1 }], "break1", daysAgo(13, 10, 18)),
    completedOrder(budi.id,  [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break2", daysAgo(13, 12, 40)),
    // Day 10
    completedOrder(rizky.id, [{ product: p1, qty: 1 }, { product: p7, qty: 2 }], "break1", daysAgo(10, 10,  8)),
    completedOrder(dewi.id,  [{ product: p3, qty: 1 }, { product: p9, qty: 1 }], "break1", daysAgo(10, 10, 14)),
    completedOrder(eko.id,   [{ product: p4, qty: 1 }, { product: p5, qty: 1 }], "break2", daysAgo(10, 12, 45)),
    // Day 7
    completedOrder(sari.id,  [{ product: p1, qty: 2 }, { product: p7, qty: 1 }], "break1", daysAgo( 7, 10,  3)),
    completedOrder(budi.id,  [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo( 7, 10, 11)),
    completedOrder(rizky.id, [{ product: p3, qty: 1 }, { product: p6, qty: 1 }], "break2", daysAgo( 7, 12, 38)),
    completedOrder(dewi.id,  [{ product: p10, qty: 1 }, { product: p7, qty: 1 }], "break2", daysAgo( 7, 12, 52)),
    // Day 5
    completedOrder(eko.id,   [{ product: p1, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo( 5, 10,  5)),
    completedOrder(sari.id,  [{ product: p2, qty: 1 }, { product: p7, qty: 2 }], "break1", daysAgo( 5, 10,  9)),
    completedOrder(budi.id,  [{ product: p3, qty: 1 }, { product: p5, qty: 2 }], "break2", daysAgo( 5, 12, 34)),
    // Day 3
    completedOrder(rizky.id, [{ product: p1, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo( 3, 10,  6)),
    completedOrder(dewi.id,  [{ product: p3, qty: 1 }, { product: p9, qty: 1 }], "break1", daysAgo( 3, 10, 13)),
    completedOrder(eko.id,   [{ product: p4, qty: 1 }, { product: p7, qty: 1 }], "break2", daysAgo( 3, 12, 41)),
    completedOrder(sari.id,  [{ product: p1, qty: 1 }, { product: p6, qty: 2 }], "break2", daysAgo( 3, 12, 50)),
    // Day 1 (yesterday)
    completedOrder(budi.id,  [{ product: p1, qty: 1 }, { product: p7, qty: 1 }], "break1", daysAgo( 1, 10,  4)),
    completedOrder(rizky.id, [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo( 1, 10, 10)),
    completedOrder(dewi.id,  [{ product: p3, qty: 1 }, { product: p5, qty: 1 }], "break2", daysAgo( 1, 12, 37)),
    completedOrder(eko.id,   [{ product: p10, qty: 1 }, { product: p11, qty: 1 }], "break2", daysAgo( 1, 12, 48)),
  ]);

  // --- Today's completed orders (for dashboard stats + chart) ---

  await Promise.all([
    completedOrder(sari.id,  [{ product: p1, qty: 1 }, { product: p7, qty: 1 }], "break1", daysAgo(0, 10,  5)),
    completedOrder(budi.id,  [{ product: p2, qty: 1 }, { product: p8, qty: 1 }], "break1", daysAgo(0, 10,  8)),
    completedOrder(rizky.id, [{ product: p3, qty: 1 }, { product: p7, qty: 2 }], "break1", daysAgo(0, 10, 12)),
    completedOrder(dewi.id,  [{ product: p1, qty: 2 }, { product: p5, qty: 1 }], "break2", daysAgo(0, 12, 35)),
    completedOrder(eko.id,   [{ product: p4, qty: 1 }, { product: p6, qty: 1 }], "break2", daysAgo(0, 12, 40)),
  ]);

  // --- Active queue orders ---

  await Promise.all([
    prisma.order.create({
      data: {
        userId:   sari.id,
        timeSlot: "break1",
        total:    p1.price + p8.price,
        status:   "PREPARING",
        items: { create: [
          { productId: p1.id, name: p1.name, price: p1.price, quantity: 1 },
          { productId: p8.id, name: p8.name, price: p8.price, quantity: 1 },
        ]},
      },
    }),
    prisma.order.create({
      data: {
        userId:   budi.id,
        timeSlot: "break1",
        total:    p2.price + p7.price * 2,
        status:   "READY",
        items: { create: [
          { productId: p2.id, name: p2.name, price: p2.price, quantity: 1 },
          { productId: p7.id, name: p7.name, price: p7.price, quantity: 2 },
        ]},
      },
    }),
    prisma.order.create({
      data: {
        userId:   eko.id,
        timeSlot: "break2",
        total:    p3.price + p9.price,
        status:   "PREPARING",
        items: { create: [
          { productId: p3.id, name: p3.name, price: p3.price, quantity: 1 },
          { productId: p9.id, name: p9.name, price: p9.price, quantity: 1 },
        ]},
      },
    }),
  ]);

  await prisma.$disconnect();

  const accounts = [
    { email: "admin@ecanteen.id",   pass: "admin123",   role: "ADMIN"   },
    { email: "penjual@ecanteen.id", pass: "penjual123", role: "PENJUAL" },
    { email: "budi@siswa.id",       pass: "user123",    role: "USER"    },
    { email: "dewi@siswa.id",       pass: "user123",    role: "USER"    },
    { email: "eko@siswa.id",        pass: "user123",    role: "USER"    },
    { email: "sari@siswa.id",       pass: "user123",    role: "USER"    },
    { email: "rizky@siswa.id",      pass: "user123",    role: "USER"    },
  ];

  console.log("Seeded successfully!");
  console.log("Accounts:");
  for (const a of accounts) {
    console.log(`  ${a.email.padEnd(28)} / ${a.pass.padEnd(12)} (${a.role})`);
  }
  console.log("");
  console.log("Products: 11  |  Orders: 48 historical + 5 today + 3 active");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});