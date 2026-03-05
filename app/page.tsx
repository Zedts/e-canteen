import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getUserOrdersSafe } from "@/src/lib/orders";
import HomeUser from "@/src/main/home-user";
import HomeAdmin from "@/src/main/home-admin";
import AdminQueue from "@/src/main/admin-queue";
import AdminMenu from "@/src/main/admin-menu";
import AdminLaporan from "@/src/main/admin-laporan";
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

  // Root path — redirect authenticated users to their home
  if (!view) {
    if (session?.user.role === "ADMIN") redirect("/home-admin");
    if (session) redirect("/home-user");
    return <Login />;
  }

  if (view === "register") return <Register />;

  // Protected pages — require active session
  if (!session) redirect("/");

  if (view === "home-user") {
    if (session.user.role === "ADMIN") redirect("/home-admin");
    return <HomeUser user={session.user} />;
  }

  if (view === "home-admin") {
    if (session.user.role === "USER") redirect("/home-user");
    return <HomeAdmin />;
  }

  if (view === "order") {
    if (session.user.role === "ADMIN") redirect("/home-admin");
    return <Order user={session.user} />;
  }

  if (view === "history") {
    if (session.user.role === "ADMIN") redirect("/home-admin");
    const orders = await getUserOrdersSafe(session.user.id);
    return <History user={session.user} orders={orders ?? []} dbUnavailable={orders === null} />;
  }

  if (view === "admin-queue") {
    if (session.user.role === "USER") redirect("/home-user");
    return <AdminQueue />;
  }

  if (view === "admin-menu") {
    if (session.user.role === "USER") redirect("/home-user");
    return <AdminMenu />;
  }

  if (view === "admin-laporan") {
    if (session.user.role === "USER") redirect("/home-user");
    return <AdminLaporan />;
  }

  redirect("/");
}