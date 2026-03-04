"use server";

import bcrypt from "bcryptjs";
import { db } from "./db";

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
