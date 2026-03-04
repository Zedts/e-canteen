import Home from '@/src/main/home-user';
import Login from '@/src/main/login';
import Register from '@/src/main/register';
import HomeAdmin from '@/src/main/home-admin';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const view = resolvedParams?.view;

  if (view === 'home-user') return <Home />;
  if (view === 'home-admin') return <HomeAdmin />;
  if (view === 'register') return <Register />;

  return <Login />;
}