import { AdminShell } from "@/src/components/admin/admin-shell";
import { UsersTable } from "@/src/components/admin/users-table";
import type { AdminUser } from "@/src/types/admin";

interface AdminUsersProps {
  users: AdminUser[];
  dbUnavailable?: boolean;
}

export default function AdminUsers({ users, dbUnavailable }: AdminUsersProps) {
  return (
    <AdminShell activePage="users">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Daftar seluruh akun pengguna dan penjual di platform.
          </p>
        </div>

        {dbUnavailable ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 text-sm text-yellow-800">
            Data pengguna tidak tersedia saat ini. Pastikan koneksi database aktif.
          </div>
        ) : (
          <UsersTable initialUsers={users} />
        )}
      </div>
    </AdminShell>
  );
}
