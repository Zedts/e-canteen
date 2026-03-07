import { AdminShell } from "@/src/components/admin/admin-shell";
import { RegisterPenjualForm } from "@/src/components/admin/register-penjual-form";

export default function AdminDaftarPenjual() {
  return (
    <AdminShell activePage="daftar-penjual">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Daftarkan Penjual</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Buat akun penjual baru untuk mengakses portal kantin.
          </p>
        </div>

        <RegisterPenjualForm />
      </div>
    </AdminShell>
  );
}
