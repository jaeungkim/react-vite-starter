import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { exampleQueries } from '@/apis/example';
import ExampleForm from '@/pages/HomePage/components/ExampleForm';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    ...exampleQueries.list(),
    enabled: Boolean(import.meta.env.VITE_API_BASE_URL),
  });

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Home</h1>

      <nav className="flex gap-4 text-sm">
        <Link to="/" className="underline">
          Home
        </Link>
        <Link to="/does-not-exist" className="underline">
          Trigger 404
        </Link>
      </nav>

      <section>
        <h2 className="mb-2 font-semibold">Example query</h2>
        {!import.meta.env.VITE_API_BASE_URL ? (
          <p className="text-muted-foreground text-sm">
            Set <code>VITE_API_BASE_URL</code> in <code>.env.local</code> to
            enable the example query.
          </p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-destructive text-sm">
            Query failed: {(error as Error).message}
          </p>
        ) : (
          <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Example form</h2>
        <ExampleForm />
      </section>
    </main>
  );
}
