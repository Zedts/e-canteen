import { AdminShell } from "@/src/components/admin/admin-shell";
import { CategoriesTable } from "@/src/components/admin/categories-table";
import type { Category } from "@/src/types/product";

interface AdminCategoriesProps {
  initialCategories: Category[];
  dbUnavailable?: boolean;
}

export default function AdminCategories({ initialCategories, dbUnavailable }: AdminCategoriesProps) {
  return (
    <AdminShell activePage="categories">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Kategori Menu</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Kelola daftar kategori yang tersedia untuk produk di kantin.
          </p>
        </div>

        {dbUnavailable ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 text-sm text-yellow-800">
            Data kategori tidak tersedia saat ini. Pastikan koneksi database aktif.
          </div>
        ) : (
          <CategoriesTable initialCategories={initialCategories} />
        )}
      </div>
    </AdminShell>
  );
}
