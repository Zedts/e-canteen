import { Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { TimeSlot } from "@/src/lib/menu-data";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({ slots, selected, onSelect }: TimeSlotPickerProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Pilih Waktu Pengambilan
          </h2>
          <p className="text-sm text-gray-500">
            Tentukan kapan Anda ingin mengambil pesanan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => {
          const isActive = selected.id === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => onSelect(slot)}
              className={cn(
                "bg-white border rounded-xl p-4 text-left transition-all shadow-sm hover:border-brand-300",
                isActive
                  ? "border-brand-400 ring-2 ring-brand-200"
                  : "border-gray-200",
              )}
            >
              <p className="font-bold text-gray-900 text-sm sm:text-base">
                {slot.label}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{slot.time}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
