import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "PENJUAL" | "ADMIN";
      balance: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "PENJUAL" | "ADMIN";
    balance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "USER" | "PENJUAL" | "ADMIN";
    balance: number;
  }
}
