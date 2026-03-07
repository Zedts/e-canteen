export type AdminPage = "dashboard" | "users" | "daftar-penjual";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "PENJUAL" | "ADMIN";
  balance: number;
  createdAt: Date;
  orderCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalPenjual: number;
  totalOrders: number;
}
