"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ImageOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { MENU_CATEGORIES, type MenuItem, type MenuCategory } from "@/src/lib/menu-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItemFormData {
  name: string;
  category: MenuCategory;
  price: string;
  imageUrl: string;
  available: boolean;
}

interface MenuItemModalProps {
  mode: "add" | "edit";
  initialData?: MenuItem;
  onSave: (data: MenuItemFormData) => void;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof MenuItemFormData, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: MenuItemFormData = {
  name: "",
  category: "Makanan Utama",
  price: "",
  imageUrl: "",
  available: true,
};

function formFromItem(item: MenuItem): MenuItemFormData {
  return {
    name: item.name,
    category: item.category,
    price: String(item.price),
    imageUrl: item.imageUrl,
    available: item.available,
  };
}

// ─── Image Preview ────────────────────────────────────────────────────────────

// Isolated as its own component so that mounting a new key resets error state
// without needing a useEffect + setState pattern that triggers cascading renders.
function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="mt-2 h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400">
        <ImageOff className="w-6 h-6" />
        <span className="text-xs">Gambar tidak dapat dimuat</span>
      </div>
    );
  }

  return (
    <div className="mt-2 h-32 bg-gray-100 rounded-xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Preview" className="w-full h-full object-cover" onError={() => setError(true)} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MenuItemModal({ mode, initialData, onSave, onClose }: MenuItemModalProps) {
  const [form, setForm] = useState<MenuItemFormData>(() =>
    mode === "edit" && initialData ? formFromItem(initialData) : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function setField<K extends keyof MenuItemFormData>(key: K, value: MenuItemFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi.";
    const price = Number(form.price);
    if (!form.price || isNaN(price) || price <= 0) next.price = "Harga harus berupa angka positif.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  if (typeof document === "undefined") return null;

  const title = mode === "add" ? "Tambah Menu Baru" : "Edit Menu";
  const subtitle = mode === "add" ? "Isi detail menu baru di bawah ini." : "Perbarui informasi menu yang dipilih.";
  const submitLabel = mode === "add" ? "Tambah Menu" : "Simpan Perubahan";

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Contoh: Nasi Goreng Spesial"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors",
                errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-brand-500",
              )}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setField("category", e.target.value as MenuCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-500 transition-colors bg-white"
            >
              {MENU_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="Contoh: 15000"
              min="0"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors",
                errors.price ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-brand-500",
              )}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Gambar</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setField("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-500 transition-colors"
            />
            {form.imageUrl && <ImagePreview key={form.imageUrl} url={form.imageUrl} />}
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Tersedia</p>
              <p className="text-xs text-gray-500 mt-0.5">Menu akan tampil di daftar pemesanan.</p>
            </div>
            <button
              type="button"
              onClick={() => setField("available", !form.available)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                form.available ? "bg-brand-500" : "bg-gray-300",
              )}
              role="switch"
              aria-checked={form.available}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  form.available ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-colors"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
