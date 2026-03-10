"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { createCategory, updateCategory, deleteCategory } from "@/src/lib/actions";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import type { Category } from "@/src/types/product";

// ─── Inline edit row ──────────────────────────────────────────────────────────

interface EditRowProps {
  value: string;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  error: string | null;
}

function EditRow({ value, onSave, onCancel, isSaving, error }: EditRowProps) {
  const [name, setName] = useState(value);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(name);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn(
          "flex-1 px-3 py-1.5 rounded-lg border text-sm outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-300 focus:border-gray-900",
        )}
        placeholder="Nama kategori"
        disabled={isSaving}
      />
      <button
        type="submit"
        disabled={isSaving || !name.trim()}
        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors"
        aria-label="Simpan"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        aria-label="Batal"
      >
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}

// ─── Add row ──────────────────────────────────────────────────────────────────

interface AddRowProps {
  onAdd: (name: string) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  onDismissError: () => void;
}

function AddRow({ onAdd, isSaving, error, onDismissError }: AddRowProps) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onAdd(name);
    setName("");
    setOpen(false);
  }

  function handleCancel() {
    setName("");
    setOpen(false);
    onDismissError();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 px-4 py-2.5 rounded-xl border border-dashed border-brand-300 hover:border-brand-400 hover:bg-brand-50 transition-all w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Tambah Kategori
      </button>
    );
  }

  return (
    <div className="px-4 py-3 border border-brand-200 rounded-xl bg-brand-50">
      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-gray-900 text-sm outline-none transition-colors"
          placeholder="Contoh: Dessert"
          disabled={isSaving}
        />
        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </form>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CategoriesTableProps {
  initialCategories: Category[];
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const [categories, setCategories]   = useState<Category[]>(initialCategories);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editError, setEditError]     = useState<string | null>(null);
  const [addError, setAddError]       = useState<string | null>(null);
  const [isSaving, setIsSaving]       = useState(false);
  const [isDeleting, setIsDeleting]   = useState(false);

  async function handleAdd(name: string) {
    setIsSaving(true);
    setAddError(null);
    const result = await createCategory(name);
    setIsSaving(false);

    if (!result.ok) {
      setAddError(result.error);
      return;
    }
    setCategories((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function handleEdit(id: string, name: string) {
    setIsSaving(true);
    setEditError(null);
    const result = await updateCategory(id, name);
    setIsSaving(false);

    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    setCategories((prev) =>
      prev
        .map((c) => (c.id === id ? result.data! : c))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    setEditingId(null);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    setActionError(null);

    const result = await deleteCategory(deletingId);
    setIsDeleting(false);

    if (!result.ok) {
      setActionError(result.error);
      setDeletingId(null);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== deletingId));
    setDeletingId(null);
  }

  const deletingCategory = categories.find((c) => c.id === deletingId);

  return (
    <>
      {actionError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex justify-between items-center">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm font-medium">Belum ada kategori. Tambahkan yang pertama!</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                  Dibuat
                </th>
                <th className="px-6 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <EditRow
                        value={cat.name}
                        onSave={(name) => handleEdit(cat.id, name)}
                        onCancel={() => { setEditingId(null); setEditError(null); }}
                        isSaving={isSaving}
                        error={editError}
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden sm:table-cell">
                    {new Date(cat.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {editingId !== cat.id && (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setEditingId(cat.id); setEditError(null); }}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          aria-label="Edit kategori"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(cat.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Hapus kategori"
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
        )}

        <div className="px-4 py-4 border-t border-gray-100">
          <AddRow
            onAdd={handleAdd}
            isSaving={isSaving}
            error={addError}
            onDismissError={() => setAddError(null)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingId}
        title="Hapus Kategori?"
        description={
          deletingCategory
            ? `Kategori "${deletingCategory.name}" akan dihapus secara permanen. Pastikan tidak ada produk yang menggunakan kategori ini.`
            : ""
        }
        confirmLabel={isDeleting ? "Menghapus..." : "Hapus"}
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
