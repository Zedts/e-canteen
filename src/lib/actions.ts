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
