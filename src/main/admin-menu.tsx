"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";
import {
  MENU_ITEMS,
  MENU_CATEGORIES,
  type MenuItem,
  type MenuCategory,
} from "@/src/lib/menu-data";
import { AdminShell } from "@/src/components/admin/admin-shell";
import { MenuItemModal, type MenuItemFormData } from "@/src/components/admin/menu-item-modal";
import { MOCK_PENDING_COUNT } from "@/src/lib/mock-dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

const ALL_CATEGORY = "Semua" as const;
type CategoryFilter = typeof ALL_CATEGORY | MenuCategory;
type ModalMode = "add" | "edit" | null;

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvailabilityBadge({ available }: { available: boolean }) {
  return available ? (
    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
      Tersedia
    </span>
  ) : (
    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
      Habis
    </span>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onToggle: (id: string) => void;
  onEdit: (item: MenuItem) => void;
}

function MenuItemCard({ item, onToggle, onEdit }: MenuItemCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all",
        item.available ? "hover:shadow-md" : "opacity-70 grayscale-40",
      )}
    >
      <div className="h-40 bg-gray-100 relative group overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3 z-10">
          <AvailabilityBadge available={item.available} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {item.category}
        </p>
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
          {item.name}
        </h3>
        <p className="font-bold text-brand-600 text-sm mb-4">
          {formatCurrency(item.price)}
        </p>

        <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggle(item.id)}
            className={cn(
              "flex-1 py-2 rounded-lg font-medium text-xs border transition-colors",
              item.available
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-green-200 text-green-600 hover:bg-green-50",
            )}
          >
            {item.available ? "Tandai Kosong" : "Tandai Tersedia"}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 py-2 rounded-lg font-medium text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(ALL_CATEGORY);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories: CategoryFilter[] = [ALL_CATEGORY, ...MENU_CATEGORIES];
  const visibleItems =
    activeCategory === ALL_CATEGORY ? items : items.filter((i) => i.category === activeCategory);

  function openAddModal() {
    setEditingItem(null);
    setModalMode("add");
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingItem(null);
  }

  function toggleAvailability(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
    );
  }

  function handleSave(data: MenuItemFormData) {
    if (modalMode === "add") {
      const newItem: MenuItem = {
        id: String(Date.now()),
        name: data.name,
        category: data.category,
        price: Number(data.price),
        imageUrl: data.imageUrl,
        available: data.available,
        rating: 0,
      };
      setItems((prev) => [...prev, newItem]);
    } else if (modalMode === "edit" && editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: data.name, category: data.category, price: Number(data.price), imageUrl: data.imageUrl, available: data.available }
            : item,
        ),
      );
    }
    closeModal();
  }

  return (
    <AdminShell activePage="menu" pendingOrderCount={MOCK_PENDING_COUNT}>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              Manajemen Menu
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tambah, perbarui, atau kelola ketersediaan item.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah Menu Baru
          </button>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm border transition-all",
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggle={toggleAvailability}
              onEdit={openEditModal}
            />
          ))}
        </div>
      </div>

      {modalMode && (
        <MenuItemModal
          mode={modalMode}
          initialData={editingItem ?? undefined}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </AdminShell>
  );
}
