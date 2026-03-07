"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

import { Button }        from "@/src/components/ui/button";
import { Checkbox }      from "@/src/components/ui/checkbox";
import { Label }         from "@/src/components/ui/label";
import { AuthCard }      from "@/src/components/auth/auth-card";
import { BrandPanel }    from "@/src/components/auth/brand-panel";
import { FormField }     from "@/src/components/auth/form-field";
import { PasswordField } from "@/src/components/auth/password-field";

export default function Login() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau kata sandi salah.");
      setIsLoading(false);
      return;
    }

    // Fetch the freshly created session to read role for redirect
    const session = await getSession();
    if (session?.user.role === "PENJUAL") router.push("/home-penjual");
    else if (session?.user.role === "ADMIN") router.push("/admin-dashboard");
    else router.push("/home-user");
  }

  return (
    <div className="min-h-screen flex font-sans">
      <BrandPanel
        headline={<>Pesan Makan,<br />Tanpa Antri.</>}
        description="Platform kantin digital untuk mempermudah pemesanan makanan di sekolah — cepat, mudah, dan praktis."
      />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <AuthCard
          title="Selamat Datang"
          description="Masuk untuk melanjutkan ke akun Anda."
          footer={
            <p className="text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

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
              onChange={setPassword}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="border-gray-300 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 font-normal cursor-pointer">
                  Ingat saya
                </Label>
              </label>
              <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors">
                Lupa kata sandi?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 focus-visible:ring-brand-500"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </AuthCard>
      </main>
    </div>
  );
}

