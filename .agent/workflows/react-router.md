---
description: React Router v7 rules — createBrowserRouter pattern.
---

# React Router v7

## 1. Mode

- `createBrowserRouter` + `RouterProvider` pattern.
- Route definitions live in `src/router.tsx` as a route config array.
- `src/App.tsx` is a layout route that renders `<Outlet />`.
- Do NOT use `loader` / `action` / `useLoaderData` — all async state
  goes through TanStack Query (`api.md`).

## 2. Imports

- Import from `react-router-dom`.

## 3. Route definition (`router.tsx`)

```tsx
import { createBrowserRouter } from 'react-router-dom';
import App from 'App';
import { StorePage } from 'pages/store/StorePage';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <StorePage /> },
    ],
  },
]);
```

Add new routes as children of the layout route. For nested layouts,
add a child with `element` + `children` and render `<Outlet />` in
that layout component.

## 4. APIs

- `useNavigate()` for imperative navigation.
- `<Link>` / `<NavLink>` for declarative navigation. Prefer over
  `onClick={() => navigate(...)}`.
- `useParams()` — validate with Zod when param drives a query.
- `useSearchParams()` for URL-shareable state.

## 5. Boundaries

Every route-level component renders its own `<Suspense>` AND
`<ErrorBoundary>`. Use `react-error-boundary` for typed error
boundaries with reset.

## 6. Placement

- `src/router.tsx` defines the route tree via `createBrowserRouter`.
- `src/App.tsx` is the root layout (`<Outlet />`).
- Route components live in `src/pages/{domain}/` per `folder.md`.
- Lazy-load with `React.lazy` + `<Suspense>` for code splitting.

## 7. Typed search params

```ts
// src/lib/searchParams.ts
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

export function useTypedSearchParams<S extends z.ZodTypeAny>(schema: S) {
  const [params, setParams] = useSearchParams();
  const parsed = schema.parse(Object.fromEntries(params));
  return [parsed, setParams] as const;
}
```
