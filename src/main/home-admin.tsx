"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, ShieldCheck } from "lucide-react";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";

export default function HomeAdmin() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-2 text-sm">Anda masuk sebagai administrator.</p>
      </div>

      <button
        onClick={() => setShowLogoutDialog(true)}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-soft transition-all"
      >
        <LogOut className="w-4 h-4" />
        Keluar
      </button>

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
    </div>
  );
}