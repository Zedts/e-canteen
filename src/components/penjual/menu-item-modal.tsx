"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ImageOff, Link as LinkIcon, Upload, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Product } from "@/src/types/product";
import { MENU_CATEGORIES, type MenuCategory } from "@/src/lib/menu-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItemFormData {
  name:      string;
  category:  MenuCategory;
  price:     string;
  imageUrl:  string;
  available: boolean;
}

interface MenuItemModalProps {
  mode:         "add" | "edit";
  initialData?: Product;
  onSave:       (data: MenuItemFormData) => void;
  onClose:      () => void;
}

type ImageMode  = "url" | "file";
type FormErrors = Partial<Record<keyof MenuItemFormData, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: MenuItemFormData = {
  name:      "",
  category:  "Makanan Utama",
  price:     "",
  imageUrl:  "",
  available: true,
};

function formFromItem(item: Product): MenuItemFormData {
  return {
    name:      item.name,
    category:  item.category as MenuCategory,
    price:     String(item.price),
    imageUrl:  item.imageUrl,
    available: item.available,
  };
}

// ─── Image Preview ────────────────────────────────────────────────────────────

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
      <img
        src={url}
        alt="Preview"
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MenuItemModal({ mode, initialData, onSave, onClose }: MenuItemModalProps) {
  const [form,        setForm]        = useState<MenuItemFormData>(() =>
    mode === "edit" && initialData ? formFromItem(initialData) : EMPTY_FORM,
  );
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [imageMode,   setImageMode]   = useState<ImageMode>("url");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Revoke the object URL when it changes or the component unmounts
  useEffect(() => {
    return () => { if (filePreview) URL.revokeObjectURL(filePreview); };
  }, [filePreview]);

  function setField<K extends keyof MenuItemFormData>(key: K, value: MenuItemFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function switchImageMode(next: ImageMode) {
    setImageMode(next);
    setUploadError(null);
    if (next === "url") {
      setPendingFile(null);
      if (filePreview) { URL.revokeObjectURL(filePreview); setFilePreview(null); }
    } else {
      setField("imageUrl", "");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (filePreview) URL.revokeObjectURL(filePreview);
    setPendingFile(file);
    setFilePreview(URL.createObjectURL(file));
    setUploadError(null);
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi.";
    const price = Number(form.price);
    if (!form.price || isNaN(price) || price <= 0) next.price = "Harga harus berupa angka positif.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (imageMode === "file" && pendingFile) {
      setUploading(true);
      setUploadError(null);
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const res  = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json() as { path?: string; error?: string };
        if (!res.ok) {
          setUploadError(json.error ?? "Upload gagal.");
          setUploading(false);
          return;
        }
        onSave({ ...form, imageUrl: json.path! });
      } catch {
        setUploadError("Gagal mengunggah gambar. Coba lagi.");
        setUploading(false);
      }
      return;
    }

    onSave(form);
  }

  if (typeof document === "undefined") return null;

  const title       = mode === "add" ? "Tambah Menu Baru"   : "Edit Menu";
  const subtitle    = mode === "add" ? "Isi detail menu baru di bawah ini." : "Perbarui informasi menu yang dipilih.";
  const submitLabel = mode === "add" ? "Tambah Menu"         : "Simpan Perubahan";

  const previewUrl = imageMode === "file" ? filePreview : form.imageUrl || null;

  return createPortal(
    <div
      className="fixed inset-0 z-500 flex items-center justify-center p-4"
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
                errors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500",
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
                errors.price
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500",
              )}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          {/* Image — Tab switcher */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gambar</label>

            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-3 w-fit">
              <button
                type="button"
                onClick={() => switchImageMode("url")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  imageMode === "url"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                URL
              </button>
              <button
                type="button"
                onClick={() => switchImageMode("file")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  imageMode === "file"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-500 transition-colors"
              />
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {pendingFile ? pendingFile.name : "Pilih gambar (JPG, PNG, WebP, GIF — maks. 2 MB)"}
                </button>
                {uploadError && (
                  <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                )}
              </div>
            )}

            {previewUrl && <ImagePreview key={previewUrl} url={previewUrl} />}
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
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}