import Home from '@/src/main/home';
import Login from '@/src/main/login';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const view = resolvedParams?.view;

  if (view === 'home') {
    return (
        <Home />
    );
  }

  return (
        <Login />
  );
}