import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VIEW_ROUTES: Record<string, string> = {
  "/home-user":           "home-user",
  "/home-penjual":        "home-penjual",
  "/register":            "register",
  "/order":               "order",
  "/history":             "history",
  "/penjual-queue":       "penjual-queue",
  "/penjual-menu":        "penjual-menu",
  "/penjual-laporan":     "penjual-laporan",
  "/admin-dashboard":     "admin-dashboard",
  "/admin-users":         "admin-users",
  "/admin-daftar-penjual": "admin-daftar-penjual",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const view = VIEW_ROUTES[pathname];
  if (!view) return;

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("view", view);
  return NextResponse.rewrite(url);
}