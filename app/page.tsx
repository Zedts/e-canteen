import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getUserOrdersSafe } from "@/src/lib/orders";
import HomeUser from "@/src/main/home-user";
import HomePenjual from "@/src/main/home-penjual";
import PenjualQueue from "@/src/main/penjual-queue";
import PenjualMenu from "@/src/main/penjual-menu";
import PenjualLaporan from "@/src/main/penjual-laporan";
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
    if (session?.user.role === "PENJUAL") redirect("/home-penjual");
    if (session) redirect("/home-user");
    return <Login />;
  }

  if (view === "register") return <Register />;

  // Protected pages — require active session
  if (!session) redirect("/");

  if (view === "home-user") {
    if (session.user.role === "PENJUAL") redirect("/home-penjual");
    return <HomeUser user={session.user} />;
  }

  if (view === "home-penjual") {
    if (session.user.role === "USER") redirect("/home-user");
    return <HomePenjual />;
  }

  if (view === "order") {
    if (session.user.role === "PENJUAL") redirect("/home-penjual");
    return <Order user={session.user} />;
  }

  if (view === "history") {
    if (session.user.role === "PENJUAL") redirect("/home-penjual");
    const orders = await getUserOrdersSafe(session.user.id);
    return <History user={session.user} orders={orders ?? []} dbUnavailable={orders === null} />;
  }

  if (view === "penjual-queue") {
    if (session.user.role === "USER") redirect("/home-user");
    return <PenjualQueue />;
  }

  if (view === "penjual-menu") {
    if (session.user.role === "USER") redirect("/home-user");
    return <PenjualMenu />;
  }

  if (view === "penjual-laporan") {
    if (session.user.role === "USER") redirect("/home-user");
    return <PenjualLaporan />;
  }

  redirect("/");
}