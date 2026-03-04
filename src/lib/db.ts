import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

function parseDbUrl(url: string) {
  const parsed = new URL(url);
  return {
    host:            parsed.hostname,
    port:            parseInt(parsed.port) || 3306,
    user:            decodeURIComponent(parsed.username),
    password:        decodeURIComponent(parsed.password),
    database:        parsed.pathname.slice(1),
    connectionLimit: 5,
  };
}

function createClient() {
  const adapter = new PrismaMariaDb(parseDbUrl(process.env.DATABASE_URL!));
  return new PrismaClient({ adapter });
}

declare global {
  // Persist the singleton across hot-reloads in development
  var __prisma: PrismaClient | undefined;
}

export const db = globalThis.__prisma ?? (globalThis.__prisma = createClient());
