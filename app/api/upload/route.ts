import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/gif":  ".gif",
};

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["PENJUAL", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran file melebihi batas 2 MB." },
      { status: 400 },
    );
  }

  const filename = `${randomUUID()}${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());
  await writeFile(join(process.cwd(), "public", "uploads", filename), buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
