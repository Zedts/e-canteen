// dotenv/config MUST be first import — loads .env synchronously
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

async function seed() {
  const adapter = new PrismaMariaDb(buildDbConfig());
  const prisma  = new PrismaClient({ adapter });

  console.log("🌱 Seeding database...");

  await prisma.user.deleteMany();

  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash("penjual123", 12),
    bcrypt.hash("user123", 12),
  ]);

  await prisma.user.createMany({
    data: [
      {
        name:     "Penjual Kantin",
        email:    "penjual@ecanteen.id",
        password: adminHash,
        role:     "PENJUAL",
        balance:  0,
      },
      {
        name:     "Sarah Jenkins",
        email:    "sarah@siswa.id",
        password: userHash,
        role:     "USER",
        balance:  245000,
      },
    ],
  });

  await prisma.$disconnect();

  console.log("✅ Seeded 2 accounts:");
  console.log("   penjual@ecanteen.id / penjual123 (PENJUAL)");
  console.log("   sarah@siswa.id      / user123   (USER)");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
