import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import HomeUser from "@/src/main/home-user";
import HomeAdmin from "@/src/main/home-admin";
import Login from "@/src/main/login";
import Register from "@/src/main/register";

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

  redirect("/");
}