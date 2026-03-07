import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthSessionProvider } from "@/src/context/session-provider";
import { CartProvider } from "@/src/context/cart-context";
import { GlobalCartFab } from "@/src/components/order/global-cart-fab";
import { getActiveProducts } from "@/src/lib/actions";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Canteen",
  description: "Platform pemesanan kantin digital",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getActiveProducts();

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthSessionProvider>
          <CartProvider products={products}>
            {children}
            <GlobalCartFab />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
