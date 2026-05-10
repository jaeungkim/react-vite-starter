import { ErrorBoundary, Suspense } from '@suspensive/react';
import { overlay } from 'overlay-kit';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ExampleDialog from '@/pages/HomePage/components/ExampleDialog';
import ExampleForm from '@/pages/HomePage/components/ExampleForm';
import ExampleList from '@/pages/HomePage/components/ExampleList';
import { MotionDemo } from '@/pages/HomePage/components/MotionDemo';
import { ThemeToggle } from '@/pages/HomePage/components/ThemeToggle';

async function openExampleDialog() {
  const confirmed = await overlay.openAsync<boolean>(
    ({ isOpen, close, unmount }) => (
      <ExampleDialog isOpen={isOpen} close={close} unmount={unmount} />
    ),
  );
  toast.success(`Dialog closed: ${confirmed ? 'confirmed' : 'cancelled'}`);
}

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-xl font-semibold">Home</h1>
          <p className="text-muted-foreground text-xs">
            Starter playground — query, form, dialog, motion, and theming
            demos.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <nav className="text-muted-foreground flex gap-4 text-xs font-medium">
        <Link to="/" className="hover:text-foreground hover:underline">
          Home
        </Link>
        <Link
          to="/does-not-exist"
          className="hover:text-foreground hover:underline"
        >
          Trigger 404
        </Link>
      </nav>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Example query</CardTitle>
            <CardDescription>
              TanStack Query + Suspense + ErrorBoundary fetching{' '}
              <code>/users</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary
              fallback={({ error, reset }) => (
                <div className="text-destructive flex items-center gap-2 text-sm">
                  <span>Query failed: {error.message}</span>
                  <Button size="sm" variant="outline" onClick={reset}>
                    Retry
                  </Button>
                </div>
              )}
            >
              <Suspense
                fallback={
                  <p className="text-muted-foreground text-sm">Loading…</p>
                }
              >
                <div className="bg-muted/40 max-h-72 overflow-auto rounded-md p-3">
                  <ExampleList />
                </div>
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example form</CardTitle>
            <CardDescription>
              react-hook-form + Zod via shadcn Form primitives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExampleForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example dialog</CardTitle>
            <CardDescription>
              overlay-kit imperative dialog with awaited result.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openExampleDialog}>Open dialog</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Motion</CardTitle>
            <CardDescription>Framer Motion animation demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <MotionDemo />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
