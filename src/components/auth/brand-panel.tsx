type BrandPanelProps = {
  headline: React.ReactNode;
  description: string;
};

export function BrandPanel({ headline, description }: BrandPanelProps) {
  return (
    <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-brand-500 p-12 relative overflow-hidden">
      <span className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-600/40" />
      <span className="absolute -bottom-16 -left-16 size-64 rounded-full bg-amber-300/30" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase">
          E-Canteen
        </span>
      </div>

      <div className="relative z-10 space-y-4">
        <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight">
          {headline}
        </h1>
        <p className="text-amber-100 text-base leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      <p className="relative z-10 text-amber-200/60 text-xs">
        © {new Date().getFullYear()} E-Canteen. All rights reserved.
      </p>
    </aside>
  );
}
