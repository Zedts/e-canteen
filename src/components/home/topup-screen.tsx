"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { topUpBalance } from "@/src/lib/actions";
import { formatCurrency } from "@/src/lib/utils";

const PRESET_AMOUNTS = [10_000, 25_000, 50_000, 75_000, 100_000, 200_000] as const;
const MIN_TOPUP = 10_000;
const MAX_TOPUP = 10_000_000;

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  abbr: string;
  tileClass: string;
  abbrClass: string;
}

const PAYMENT_GROUPS: { group: string; methods: PaymentMethod[] }[] = [
  {
    group: "E-Wallet",
    methods: [
      { id: "gopay",     name: "GoPay",     description: "Dompet digital Gojek",  abbr: "G",   tileClass: "bg-emerald-500",    abbrClass: "text-white" },
      { id: "ovo",       name: "OVO",       description: "Dompet digital OVO",   abbr: "O",   tileClass: "bg-violet-600",     abbrClass: "text-white" },
      { id: "dana",      name: "Dana",      description: "Dompet digital Dana",  abbr: "D",   tileClass: "bg-blue-500",       abbrClass: "text-white" },
      { id: "shopeepay", name: "ShopeePay", description: "Dompet digital Shopee", abbr: "SP",  tileClass: "bg-orange-500",     abbrClass: "text-white" },
    ],
  },
  {
    group: "Transfer Bank",
    methods: [
      { id: "bca",     name: "BCA",     description: "Virtual Account BCA",     abbr: "BCA", tileClass: "bg-blue-600",       abbrClass: "text-white" },
      { id: "mandiri", name: "Mandiri", description: "Virtual Account Mandiri", abbr: "M",   tileClass: "bg-amber-400",      abbrClass: "text-gray-900" },
      { id: "bni",     name: "BNI",     description: "Virtual Account BNI",     abbr: "BNI", tileClass: "bg-orange-600",     abbrClass: "text-white" },
      { id: "bri",     name: "BRI",     description: "Virtual Account BRI",     abbr: "BRI", tileClass: "bg-sky-700",        abbrClass: "text-white" },
    ],
  },
];

const ALL_METHODS = PAYMENT_GROUPS.flatMap((g) => g.methods);

interface TopUpScreenProps {
  user: { id: string; balance: number };
  onBack: () => void;
  onSuccess: (newBalance: number) => void;
}

type Step = "select" | "payment" | "confirm" | "done";

export function TopUpScreen({ user, onBack, onSuccess }: TopUpScreenProps) {
  const [step, setStep]               = useState<Step>("select");
  const [preset, setPreset]           = useState<number | null>(null);
  const [custom, setCustom]           = useState("");
  const [methodId, setMethodId]       = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [resultBalance, setResultBalance] = useState(0);

  const parsedCustom = custom ? parseInt(custom, 10) : NaN;
  const amount       = preset ?? (Number.isFinite(parsedCustom) ? parsedCustom : null);
  const customValid  = Number.isFinite(parsedCustom) && parsedCustom >= MIN_TOPUP && parsedCustom <= MAX_TOPUP;
  const amountReady  = preset !== null || customValid;
  const method       = ALL_METHODS.find((m) => m.id === methodId) ?? null;

  function pickPreset(value: number) {
    setPreset(value);
    setCustom("");
    setError("");
  }

  function typeCustom(raw: string) {
    setCustom(raw.replace(/\D/g, ""));
    setPreset(null);
    setError("");
  }

  async function handleConfirm() {
    if (!amount) return;
    setLoading(true);
    setError("");

    const result = await topUpBalance(user.id, amount);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setResultBalance(result.data!.newBalance);
    setStep("done");
    setTimeout(() => onSuccess(result.data!.newBalance), 2000);
  }

  if (step === "done") {
    return <DoneScreen amount={amount!} method={method!} newBalance={resultBalance} />;
  }

  if (step === "confirm") {
    return (
      <ConfirmScreen
        currentBalance={user.balance}
        amount={amount!}
        method={method!}
        loading={loading}
        error={error}
        onBack={() => setStep("payment")}
        onConfirm={handleConfirm}
      />
    );
  }

  if (step === "payment") {
    return (
      <PaymentScreen
        selectedId={methodId}
        onSelect={setMethodId}
        onBack={() => setStep("select")}
        onContinue={() => setStep("confirm")}
      />
    );
  }

  return (
    <SelectScreen
      currentBalance={user.balance}
      preset={preset}
      custom={custom}
      canProceed={amountReady}
      onPickPreset={pickPreset}
      onTypeCustom={typeCustom}
      onBack={onBack}
      onContinue={() => setStep("payment")}
    />
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shrink-0"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}

interface SelectScreenProps {
  currentBalance: number;
  preset: number | null;
  custom: string;
  canProceed: boolean;
  onPickPreset: (v: number) => void;
  onTypeCustom: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function SelectScreen({
  currentBalance,
  preset,
  custom,
  canProceed,
  onPickPreset,
  onTypeCustom,
  onBack,
  onContinue,
}: SelectScreenProps) {
  const parsedCustom = custom ? parseInt(custom, 10) : NaN;
  const showPreview = !preset && Number.isFinite(parsedCustom) && parsedCustom > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
        <ScreenHeader title="Isi Saldo" onBack={onBack} />

        <div className="mt-8 flex flex-col gap-6">
          <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500 opacity-20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-1">Saldo saat ini</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(currentBalance)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
              Pilih Nominal
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((value) => (
                <button
                  key={value}
                  onClick={() => onPickPreset(value)}
                  className={`py-3 px-2 rounded-2xl border-2 text-sm font-bold transition-all ${
                    preset === value
                      ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/40"
                  }`}
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
              Nominal Lainnya
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={custom}
                onChange={(e) => onTypeCustom(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 bg-white border-2 border-gray-200 focus:border-brand-500 rounded-2xl text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-300"
              />
            </div>
            {showPreview ? (
              <p className="text-xs text-brand-600 font-semibold mt-2 pl-1">
                = {formatCurrency(parsedCustom)}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-2 pl-1">
                Min. {formatCurrency(MIN_TOPUP)} · Maks. {formatCurrency(MAX_TOPUP)}
              </p>
            )}
          </div>

          <button
            onClick={onContinue}
            disabled={!canProceed}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-base shadow-float transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

interface PaymentScreenProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function PaymentScreen({ selectedId, onSelect, onBack, onContinue }: PaymentScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
        <ScreenHeader title="Metode Pembayaran" onBack={onBack} />

        <div className="mt-8 flex flex-col gap-8">
          {PAYMENT_GROUPS.map(({ group, methods }) => (
            <div key={group}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
                {group}
              </p>
              <div className="flex flex-col gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedId === m.id
                        ? "border-brand-500 bg-brand-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${m.tileClass} ${m.abbrClass}`}
                    >
                      {m.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
                        selectedId === m.id
                          ? "border-brand-500 bg-brand-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedId === m.id && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={onContinue}
            disabled={!selectedId}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-base shadow-float transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmScreenProps {
  currentBalance: number;
  amount: number;
  method: PaymentMethod;
  loading: boolean;
  error: string;
  onBack: () => void;
  onConfirm: () => void;
}

function ConfirmScreen({
  currentBalance,
  amount,
  method,
  loading,
  error,
  onBack,
  onConfirm,
}: ConfirmScreenProps) {
  const afterBalance = currentBalance + amount;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-8 animate-fade-in">
        <ScreenHeader title="Konfirmasi Isi Saldo" onBack={onBack} />

        <div className="mt-8 flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-soft">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-4 mb-5">
              Ringkasan
            </h2>

            <div className="space-y-4">
              <SummaryRow label="Nominal isi saldo" value={formatCurrency(amount)} />

              <div>
                <p className="text-sm text-gray-500 mb-2">Metode pembayaran</p>
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${method.tileClass} ${method.abbrClass}`}
                  >
                    {method.abbr}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-400">{method.description}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <SummaryRow label="Saldo saat ini" value={formatCurrency(currentBalance)} />
                <SummaryRow
                  label="Saldo setelah isi"
                  value={formatCurrency(afterBalance)}
                  valueClass="text-lg font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-base shadow-float transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Konfirmasi & Bayar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-sm text-gray-700 font-medium",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function DoneScreen({
  amount,
  method,
  newBalance,
}: {
  amount: number;
  method: PaymentMethod;
  newBalance: number;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Isi Saldo Berhasil!
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          {formatCurrency(amount)} telah ditambahkan ke saldo Anda.
        </p>
        <p className="text-xs text-gray-400 mb-6">via {method.name}</p>
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 inline-block shadow-soft">
          <p className="text-xs text-gray-400 mb-1">Saldo Terbaru</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(newBalance)}</p>
        </div>
      </div>
    </div>
  );
}
