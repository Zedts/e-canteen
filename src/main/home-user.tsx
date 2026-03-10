"use client";

import { useState } from "react";
import type { Product } from "@/src/types/product";
import { Navbar }         from "@/src/components/home/navbar";
import { BottomNav }      from "@/src/components/home/bottom-nav";
import { WalletCard }     from "@/src/components/home/wallet-card";
import { PreorderBanner } from "@/src/components/home/preorder-banner";
import { CategoryFilter } from "@/src/components/home/category-filter";
import { MenuCard }       from "@/src/components/home/menu-card";
import { TopUpScreen }    from "@/src/components/home/topup-screen";

interface HomeUserProps {
  user: {
    id:      string;
    name?:   string | null;
    email?:  string | null;
    balance: number;
    role:    "USER" | "PENJUAL" | "ADMIN";
  };
  products:   Product[];
  categories: string[];
}

type HomeStep = "home" | "topup";

export default function HomeUser({ user, products, categories }: HomeUserProps) {
  const [step, setStep]       = useState<HomeStep>("home");
  const [balance, setBalance] = useState(user.balance);

  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");

  const currentUser = { ...user, balance };

  function handleTopUpSuccess(newBalance: number) {
    setBalance(newBalance);
    setStep("home");
  }

  if (step === "topup") {
    return (
      <TopUpScreen
        user={currentUser}
        onBack={() => setStep("home")}
        onSuccess={handleTopUpSuccess}
      />
    );
  }

  const filteredMenu = products.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar user={currentUser} activePage="home" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12">
        <div className="flex flex-col space-y-8 animate-fade-in">

          <WalletCard user={currentUser} onTopUp={() => setStep("topup")} />

          <PreorderBanner />

          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />

          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Rekomendasi Hari Ini
            </h2>

            {filteredMenu.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">Tidak ada menu tersedia untuk kategori ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {filteredMenu.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
