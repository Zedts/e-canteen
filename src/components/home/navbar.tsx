"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";
import { getInitials, formatCurrency } from "@/src/lib/utils";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";

interface NavbarProps {
  user: {
    name?: string | null;
    balance: number;
  };
  activePage?: "home" | "preorder" | "history";
}

const NAV_LINKS = [
  { key: "home",     label: "Beranda",       href: "/home-user" },
  { key: "preorder", label: "Pesan Makanan",  href: "/order"     },
  { key: "history",  label: "Pesanan Saya",   href: "/history"   },
] as const;

export function Navbar({ user, activePage = "home" }: NavbarProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const initials = getInitials(user.name ?? "?");
  const firstName = user.name?.split(" ")[0] ?? "Pengguna";

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold font-serif text-sm">
                E
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">
                Kantin<span className="text-brand-500">.</span>
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-8 h-full">
              {NAV_LINKS.map(({ key, label, href }) => (
                <Link
                  key={key}
                  href={href}
                  className={[
                    "relative flex items-center h-full text-sm transition-colors",
                    activePage === key
                      ? "text-brand-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500"
                      : "text-gray-500 hover:text-gray-900",
                  ].join(" ")}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side: bell + user info */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition bg-gray-100 rounded-full hidden sm:flex">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white ring-2 ring-gray-100 shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs text-gray-500 font-medium">Halo, {firstName}</p>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">
                    {formatCurrency(user.balance)}
                  </p>
                </div>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  title="Keluar"
                  className="ml-1 p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Keluar dari akun?"
        description="Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login."
        confirmLabel="Keluar"
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
}
