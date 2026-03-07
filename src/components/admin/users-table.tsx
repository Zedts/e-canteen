"use client";

import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";
import { deleteUserById } from "@/src/lib/actions";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { EditUserModal } from "./edit-user-modal";
import type { AdminUser } from "@/src/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleFilter = "all" | "USER" | "PENJUAL";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<AdminUser["role"], string> = {
  USER:    "Pengguna",
  PENJUAL: "Penjual",
  ADMIN:   "Admin",
};

const ROLE_STYLES: Record<AdminUser["role"], string> = {
  USER:    "bg-blue-50 text-blue-700",
  PENJUAL: "bg-orange-50 text-orange-700",
  ADMIN:   "bg-purple-50 text-purple-700",
};

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  return (
    <span className={cn("text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider", ROLE_STYLES[role])}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface UsersTableProps {
  initialUsers: AdminUser[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  function handleUserSaved(updated: Pick<AdminUser, "id" | "name" | "email" | "balance">) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
    );
    setEditingUser(null);
  }

  async function confirmDelete() {
    if (!deletingUserId) return;

    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteUserById(deletingUserId);

    if (!result.ok) {
      setDeleteError(result.error);
      setIsDeleting(false);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== deletingUserId));
    setDeletingUserId(null);
    setIsDeleting(false);
  }

  const deletingUser = users.find((u) => u.id === deletingUserId);

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "USER", "PENJUAL"] as RoleFilter[]).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
                roleFilter === role
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
              )}
            >
              {role === "all" ? "Semua" : ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      {deleteError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {deleteError}
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Tidak ada akun yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">
                    Saldo
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                    Pesanan
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400 sm:hidden mt-0.5">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-4 text-gray-700 hidden md:table-cell">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-5 py-4 text-gray-700 hidden lg:table-cell">
                      {user.orderCount}
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== "ADMIN" && (
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteError(null);
                              setDeletingUserId(user.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label={`Hapus ${user.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSaved={handleUserSaved}
          onClose={() => setEditingUser(null)}
        />
      )}

      <ConfirmDialog
        open={!!deletingUserId && !isDeleting}
        title={`Hapus akun "${deletingUser?.name}"?`}
        description="Semua data pesanan akun ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingUserId(null)}
      />
    </>
  );
}
