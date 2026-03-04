import { Clock, ChevronRight } from "lucide-react";

export function PreorderBanner() {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:shadow-soft transition-shadow group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Pre-Order Istirahat 1</h3>
          <p className="text-sm text-gray-500 mt-0.5">Ditutup dalam 45 menit</p>
        </div>
      </div>

      <button className="text-brand-600 font-medium text-sm px-4 py-2 bg-white rounded-full border border-brand-200 shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-colors hidden sm:block">
        Pesan Sekarang
      </button>
      <ChevronRight className="w-5 h-5 text-brand-500 sm:hidden" />
    </div>
  );
}
