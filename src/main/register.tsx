"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button }        from "@/src/components/ui/button";
import { AuthCard }      from "@/src/components/auth/auth-card";
import { BrandPanel }    from "@/src/components/auth/brand-panel";
import { FormField }     from "@/src/components/auth/form-field";
import { PasswordField } from "@/src/components/auth/password-field";

export default function Register() {
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading]         = useState(false);

  function clearPasswordError() {
    if (passwordError) setPasswordError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    // TODO: wire up registration
    setTimeout(() => setIsLoading(false), 1500);
  }

  return (
    <div className="min-h-screen flex font-sans">
      <BrandPanel
        headline={<>Bergabung,<br />Hari Ini.</>}
        description="Buat akun dan mulai pesan makanan favoritmu di kantin sekolah dengan mudah dan cepat."
      />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <AuthCard
          title="Buat Akun"
          description="Lengkapi data diri Anda untuk mulai menggunakan E-Canteen."
          footer={
            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="name"
              label="Nama Lengkap"
              value={name}
              onChange={setName}
              placeholder="Nama lengkap Anda"
            />

            <FormField
              id="email"
              label="Alamat Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nama@sekolah.sch.id"
            />

            <PasswordField
              id="password"
              label="Kata Sandi"
              value={password}
              onChange={(v) => { setPassword(v); clearPasswordError(); }}
            />

            <PasswordField
              id="confirmPassword"
              label="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(v) => { setConfirm(v); clearPasswordError(); }}
              error={passwordError}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 focus-visible:ring-brand-500"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>
        </AuthCard>
      </main>
    </div>
  );
}
