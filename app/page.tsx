import Home from '@/src/main/home';
import Login from '@/src/main/login';
import Register from '@/src/main/register';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const view = resolvedParams?.view;

  if (view === 'home') return <Home />;
  if (view === 'register') return <Register />;

  return <Login />;
}