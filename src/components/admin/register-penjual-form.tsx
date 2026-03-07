"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { createPenjualAccount } from "@/src/lib/actions";
import { FormField }     from "@/src/components/auth/form-field";
import { PasswordField } from "@/src/components/auth/password-field";

const ADMIN_INPUT_CLASS = "rounded-xl py-3 text-sm focus-visible:ring-gray-900";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMPTY_FORM: FormState = {
  name:            "",
  email:           "",
  password:        "",
  confirmPassword: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterPenjualForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }

    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await createPenjualAccount(
      form.name.trim(),
      form.email.trim(),
      form.password,
    );

    if (!result.ok) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccessName(form.name.trim());
    setForm(EMPTY_FORM);
    setIsLoading(false);
  }

  return (
    <div className="max-w-lg">
      {successName && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            Akun penjual <span className="font-bold">{successName}</span> berhasil didaftarkan.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <FormField
          id="penjual-name"
          label="Nama Lengkap"
          placeholder="Nama penjual"
          value={form.name}
          onChange={(v) => updateField("name", v)}
          inputClassName={ADMIN_INPUT_CLASS}
        />

        <FormField
          id="penjual-email"
          label="Alamat Email"
          type="email"
          placeholder="email@ecanteen.id"
          value={form.email}
          onChange={(v) => updateField("email", v)}
          inputClassName={ADMIN_INPUT_CLASS}
        />

        <PasswordField
          id="penjual-password"
          label="Kata Sandi"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={(v) => updateField("password", v)}
          inputClassName={ADMIN_INPUT_CLASS}
        />

        <PasswordField
          id="penjual-confirm"
          label="Konfirmasi Kata Sandi"
          placeholder="Ulangi kata sandi"
          value={form.confirmPassword}
          onChange={(v) => updateField("confirmPassword", v)}
          inputClassName={ADMIN_INPUT_CLASS}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold text-white transition-colors",
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800",
          )}
        >
          {isLoading ? "Mendaftarkan..." : "Daftarkan Penjual"}
        </button>
      </form>
    </div>
  );
}
