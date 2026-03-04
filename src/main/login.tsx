"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button }   from "@/src/components/ui/button";
import { Input }    from "@/src/components/ui/input";
import { Label }    from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

// ─── Sub-component ─────────────────────────────────────────────────────────────

function FormField({
  id, label, type, value, onChange, placeholder, children,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="rounded-xl py-3 text-sm focus-visible:ring-brand-500"
        />
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // TODO: wire up authentication
    setTimeout(() => setIsLoading(false), 1500);
  }

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── Left Panel: Branding ── */}
      <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-brand-500 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <span className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-600/40" />
        <span className="absolute -bottom-16 -left-16 size-64 rounded-full bg-amber-300/30" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase">
            E-Canteen
          </span>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight">
            Pesan Makan,<br />Tanpa Antri.
          </h1>
          <p className="text-amber-100 text-base leading-relaxed max-w-sm">
            Platform kantin digital untuk mempermudah pemesanan makanan di sekolah — cepat, mudah, dan praktis.
          </p>
        </div>

        <p className="relative z-10 text-amber-200/60 text-xs">
          © {new Date().getFullYear()} E-Canteen. All rights reserved.
        </p>
      </aside>

      {/* ── Right Panel: Form ── */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <Card className="glass w-full max-w-md rounded-2xl border-gray-100 shadow-float animate-fade-in">

          <CardHeader className="pb-2">
            {/* Mobile-only brand badge */}
            <span className="inline-flex lg:hidden items-center gap-2 mb-4 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase w-fit">
              E-Canteen
            </span>
            <CardTitle className="font-serif text-3xl font-bold text-gray-900">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Masuk untuk melanjutkan ke akun Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                id="email"
                label="Alamat Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="nama@sekolah.sch.id"
              />

              <FormField
                id="password"
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-1 h-full text-gray-400 hover:text-brand-500 hover:bg-transparent"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </FormField>

              {/* Remember me + Forgot */}
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 focus-visible:ring-brand-500"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">atau</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Register CTA */}
            <p className="text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <a href="#" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                Daftar sekarang
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

