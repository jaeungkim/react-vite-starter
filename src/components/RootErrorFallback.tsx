import type { ErrorBoundaryFallbackProps } from '@suspensive/react';

import { Button } from '@/components/ui/button';

export default function RootErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {error.message}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
