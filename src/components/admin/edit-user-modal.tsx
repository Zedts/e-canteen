"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { updateUserById } from "@/src/lib/actions";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { AdminUser } from "@/src/types/admin";

const FIELD_CLASS = "rounded-xl border-gray-200 focus-visible:ring-gray-900";
const LABEL_CLASS = "font-semibold text-gray-700";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditUserModalProps {
  user: AdminUser;
  onSaved: (updated: Pick<AdminUser, "id" | "name" | "email" | "balance">) => void;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  balance: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditUserModal({ user, onSaved, onClose }: EditUserModalProps) {
  const [form, setForm] = useState<FormState>({
    name:    user.name,
    email:   user.email,
    balance: String(user.balance),
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function updateField(field: keyof FormState, value: string) {
    setError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const balance = parseInt(form.balance, 10);
    if (isNaN(balance) || balance < 0) {
      setError("Saldo harus berupa angka yang valid.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await updateUserById(user.id, {
      name:    form.name.trim(),
      email:   form.email.trim(),
      balance,
    });

    if (!result.ok) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    onSaved({ id: user.id, name: form.name.trim(), email: form.email.trim(), balance });
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-500 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-float p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="edit-user-title" className="font-bold text-gray-900 text-lg">
              Edit Akun
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className={LABEL_CLASS}>Nama</Label>
            <Input
              id="edit-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email" className={LABEL_CLASS}>Email</Label>
            <Input
              id="edit-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-balance" className={LABEL_CLASS}>Saldo (Rp)</Label>
            <Input
              id="edit-balance"
              type="number"
              min={0}
              required
              value={form.balance}
              onChange={(e) => updateField("balance", e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors",
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800",
              )}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
