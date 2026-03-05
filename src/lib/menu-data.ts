export type MenuCategory = "Makanan Utama" | "Cemilan" | "Minuman" | "Menu Sehat";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  rating: number;
  imageUrl: string;
  available: boolean;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  "Makanan Utama",
  "Cemilan",
  "Minuman",
  "Menu Sehat",
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    price: 25000,
    category: "Makanan Utama",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "2",
    name: "Nasi Goreng Spesial",
    price: 20000,
    category: "Makanan Utama",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "3",
    name: "Ayam Geprek",
    price: 18000,
    category: "Makanan Utama",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "4",
    name: "Mie Goreng",
    price: 15000,
    category: "Makanan Utama",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "5",
    name: "Pisang Goreng Crispy",
    price: 8000,
    category: "Cemilan",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "6",
    name: "Kentang Goreng",
    price: 10000,
    category: "Cemilan",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "7",
    name: "Es Teh Manis",
    price: 5000,
    category: "Minuman",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "8",
    name: "Iced Latte",
    price: 15000,
    category: "Minuman",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "9",
    name: "Jus Alpukat Susu",
    price: 12000,
    category: "Minuman",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop",
    available: false,
  },
  {
    id: "10",
    name: "Salad Buah Segar",
    price: 12000,
    category: "Menu Sehat",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
    available: true,
  },
  {
    id: "11",
    name: "Smoothie Hijau",
    price: 15000,
    category: "Menu Sehat",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop",
    available: true,
  },
];

// ─── Time Slots ───────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: "break1" | "break2";
  label: string;
  time: string;
  pickupDisplay: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: "break1",
    label: "Istirahat 1",
    time: "10:00 - 10:20",
    pickupDisplay: "Istirahat 1 • 10:00",
  },
  {
    id: "break2",
    label: "Istirahat 2",
    time: "12:30 - 13:10",
    pickupDisplay: "Istirahat 2 • 12:30",
  },
];
