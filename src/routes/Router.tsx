import { ErrorBoundary, ErrorBoundaryGroup, Suspense } from '@suspensive/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';

import RootErrorFallback from '@/components/RootErrorFallback';
import RootLayout from '@/components/RootLayout';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function Router() {
  return (
    <BrowserRouter>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundaryGroup>
            <ErrorBoundary onReset={reset} fallback={RootErrorFallback}>
              <Suspense fallback={<div className="p-6">Loading...</div>}>
                <Routes>
                  <Route element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </ErrorBoundaryGroup>
        )}
      </QueryErrorResetBoundary>
    </BrowserRouter>
  );
}
