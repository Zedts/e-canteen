export type MenuCategory = "Makanan Utama" | "Cemilan" | "Minuman" | "Menu Sehat";

export const MENU_CATEGORIES: MenuCategory[] = [
  "Makanan Utama",
  "Cemilan",
  "Minuman",
  "Menu Sehat",
];

// --- Time Slots ---

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
    pickupDisplay: "Istirahat 1 \u2022 10:00",
  },
  {
    id: "break2",
    label: "Istirahat 2",
    time: "12:30 - 13:10",
    pickupDisplay: "Istirahat 2 \u2022 12:30",
  },
];
