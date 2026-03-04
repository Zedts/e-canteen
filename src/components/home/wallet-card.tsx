import { CreditCard, Plus } from "lucide-react";
import { formatCurrency, getGreeting, getInitials } from "@/src/lib/utils";

interface WalletCardProps {
  user: {
    name?: string | null;
    balance: number;
  };
}

export function WalletCard({ user }: WalletCardProps) {
  const greeting = getGreeting();
  const initials  = getInitials(user.name ?? "?");

  return (
    <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-float">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">{greeting},</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            {user.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
            <CreditCard className="w-4 h-4" />
            Saldo Virtual
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight">
            {formatCurrency(user.balance)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {initials}
          </div>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all rounded-full py-2.5 px-6 font-medium text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Isi Saldo
          </button>
        </div>
      </div>
    </div>
  );
}
