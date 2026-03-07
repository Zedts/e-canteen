import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getUserOrdersSafe } from "@/src/lib/orders";
import { getAdminStats, listAllUsers } from "@/src/lib/actions";
import HomeUser from "@/src/main/home-user";
import HomePenjual from "@/src/main/home-penjual";
import PenjualQueue from "@/src/main/penjual-queue";
import PenjualMenu from "@/src/main/penjual-menu";
import PenjualLaporan from "@/src/main/penjual-laporan";
import AdminDashboard from "@/src/main/admin-dashboard";
import AdminUsers from "@/src/main/admin-users";
import AdminDaftarPenjual from "@/src/main/admin-daftar-penjual";
import Login from "@/src/main/login";
import Register from "@/src/main/register";
import Order from "@/src/main/order";
import History from "@/src/main/history";

type SearchParams = { view?: string };
type PageProps = { searchParams?: Promise<SearchParams> };

export default async function Page({ searchParams }: PageProps) {
  const [params, session] = await Promise.all([
    searchParams ?? Promise.resolve({}),
    getServerSession(authOptions),
  ]);

  const view = (params as SearchParams).view;
  const role = session?.user.role;

  // Root path — redirect authenticated users to their home
  if (!view) {
    if (role === "PENJUAL") redirect("/home-penjual");
    if (role === "ADMIN")   redirect("/admin-dashboard");
    if (session)            redirect("/home-user");
    return <Login />;
  }

  if (view === "register") return <Register />;

  // Protected pages — require active session
  if (!session) redirect("/");

  // ─── User pages ─────────────────────────────────────────────────────────────

  if (view === "home-user") {
    if (role === "PENJUAL") redirect("/home-penjual");
    if (role === "ADMIN")   redirect("/admin-dashboard");
    return <HomeUser user={session.user} />;
  }

  if (view === "order") {
    if (role === "PENJUAL") redirect("/home-penjual");
    if (role === "ADMIN")   redirect("/admin-dashboard");
    return <Order user={session.user} />;
  }

  if (view === "history") {
    if (role === "PENJUAL") redirect("/home-penjual");
    if (role === "ADMIN")   redirect("/admin-dashboard");
    const orders = await getUserOrdersSafe(session.user.id);
    return <History user={session.user} orders={orders ?? []} dbUnavailable={orders === null} />;
  }

  // ─── Penjual pages ───────────────────────────────────────────────────────────

  if (view === "home-penjual") {
    if (role === "USER")  redirect("/home-user");
    if (role === "ADMIN") redirect("/admin-dashboard");
    return <HomePenjual />;
  }

  if (view === "penjual-queue") {
    if (role === "USER")  redirect("/home-user");
    if (role === "ADMIN") redirect("/admin-dashboard");
    return <PenjualQueue />;
  }

  if (view === "penjual-menu") {
    if (role === "USER")  redirect("/home-user");
    if (role === "ADMIN") redirect("/admin-dashboard");
    return <PenjualMenu />;
  }

  if (view === "penjual-laporan") {
    if (role === "USER")  redirect("/home-user");
    if (role === "ADMIN") redirect("/admin-dashboard");
    return <PenjualLaporan />;
  }

  // ─── Admin pages ─────────────────────────────────────────────────────────────

  if (view === "admin-dashboard") {
    if (role !== "ADMIN") redirect("/");
    const result = await getAdminStats();
    return <AdminDashboard stats={result.ok ? result.data! : null} />;
  }

  if (view === "admin-users") {
    if (role !== "ADMIN") redirect("/");
    const result = await listAllUsers();
    return <AdminUsers users={result.ok ? result.data! : []} dbUnavailable={!result.ok} />;
  }

  if (view === "admin-daftar-penjual") {
    if (role !== "ADMIN") redirect("/");
    return <AdminDaftarPenjual />;
  }

  redirect("/");
}
