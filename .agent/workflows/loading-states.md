# Loading & Error State Conventions

Loading and error UI in this app uses three primitives — `Spinner`,
`Skeleton`, and `Empty`. Consumers wrap them inline; there is no
overlay wrapper component. Anything outside this list is a code smell.

> All user-facing strings in this file are placeholders. Replace them
> with your product's real copy, ideally via your i18n layer.

## 1. Loading vs status

- **Loading** = the user is waiting on a fetch or mutation. Use `Spinner`
  or `Skeleton`, optionally wrapped in an inline backdrop div for
  blocking actions.
- **Status** = the system is reporting its own state (an AI is
  mid-thought, a socket is reconnecting, a toast is pending). Pulsing-dot
  and colored-dot indicators are status, not loading. **Do not replace
  them with a Spinner.**

## 2. Decision rule — Skeleton vs Spinner vs blocking backdrop

1. **Skeleton** — first-paint of structured content where layout shape
   is known (tables, card grids, lists, headers). Match heights/widths
   of the real content.
2. **Spinner** — indefinite waits where layout would be misleading
   (initial section load, dialog body, infinite-scroll fetch-next,
   button submit, inline label).
3. **Inline backdrop + Spinner** — a mutation must block clicks during
   a save or other decisive action. The consumer renders a `fixed` (or
   `absolute`) backdrop div containing a `Spinner size-10 text-primary`
   and an optional label. See §5.3.

## 3. Spinner size scale

| Class                  | Use                                           |
| ---------------------- | --------------------------------------------- |
| `size-3` / `size-3.5`  | Inline icon in a button                       |
| `size-4`               | Button content / dialog footer / inline label |
| `size-5`               | Dialog body / dropdown / smaller centered region |
| `size-6`               | Section or page initial load (centered)       |
| `size-10`              | Blocking backdrop (centered inside an inline backdrop div) |

Avoid `size-7`, `size-8`, custom sizes. Use the scale above.

## 4. Spinner color scale

- `text-muted-foreground` — passive loading (initial fetch, pagination,
  infinite scroll, inline labels).
- `text-primary` — blocking backdrop (decisive action in progress).
- (no color class) — inside a button or colored container that already
  sets text color.

## 5. Layout patterns

### 5.1 Skeleton placeholder (initial structured load)

```tsx
{isPending ? (
  <div>
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
) : (
  <Content />
)}
```

### 5.2 Centered region spinner (initial section load)

```tsx
{isPending ? (
  <div className="flex h-full items-center justify-center">
    <Spinner className="size-6 text-muted-foreground" />
  </div>
) : (
  <Content />
)}
```

This 4-line pattern is intentionally not abstracted into a wrapper —
inline keeps the layout self-documenting.

### 5.3 Inline blocking backdrop (mutation in progress)

For viewport-wide blocking, use `fixed inset-0` with `bg-background/10`:

```tsx
{mutation.isPending && (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/10 backdrop-blur-xs"
  >
    <Spinner className="size-10 text-primary" />
    <span className="text-sm text-muted-foreground">Saving…</span>
  </div>
)}
```

For content-area blocking, switch to `absolute inset-0` with
`bg-background/60`. The parent **must** be `relative`:

```tsx
<div className="relative flex min-h-0 flex-1 flex-col">
  {mutation.isPending && (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-xs"
    >
      <Spinner className="size-10 text-primary" />
      <span className="text-sm text-muted-foreground">Processing…</span>
    </div>
  )}
  <Content />
</div>
```

Omit the label `<span>` when the trigger is brief enough that text is
unhelpful.

## 6. Error and zero-result states

Always use the `Empty` compound from
`components/ui/default/empty.tsx`. Never plain-text errors. Never
custom error components.

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <SearchX />
    </EmptyMedia>
    <EmptyTitle>Couldn't load the data</EmptyTitle>
    <EmptyDescription>
      Check your connection and try again.
    </EmptyDescription>
  </EmptyHeader>
  <Button variant="outline" onClick={resetFilters}>
    Try again
  </Button>
</Empty>
```

Icon picks:

- `AlertTriangle` — generic / uncaught error
- `SearchX` — "not found" / "no result"
- `FileSearch` — "no permission" / "missing entity"
- Domain-specific icons are fine when they communicate state better

## 7. Router-level safety net

`<RouteErrorBoundary>` from `components/RouteErrorBoundary.tsx` wraps
the route tree in `routes/Router.tsx`. It catches uncaught render
errors (white-screen-of-death case) and renders the standard `Empty`
fallback with a "Try again" reset.

It does **not** replace inline `isError` handling. Pages still
inline-handle `isError` from `useQuery` for contextual recoverable
errors (404, validation failures, retry-friendly states). The boundary
is for the unexpected.

## 8. Secondary-data fetches without UI

Some queries fetch data that is only used for an enrichment (e.g. a
version badge, a count). When the absence of that data has a sensible
visual fallback (`—`, `0`, hidden), no loading or error UI is required
at the layout level — the primary content (`Outlet`, children) handles
its own state.

## 9. Primitives — file paths

- `src/components/ui/default/spinner.tsx`
- `src/components/ui/default/skeleton.tsx`
- `src/components/ui/default/empty.tsx`
- `src/components/RouteErrorBoundary.tsx`

## 10. Cross-references

- `.agent/workflows/components.md` §7 — styling rules (cn, no inline
  className variables, semantic tokens).
- `.agent/workflows/shadcn.md` §3 — wrap-don't-override; `default/`
  primitives are immutable vendor code.
- `.agent/workflows/react-router.md` §5 — every route-level component
  renders its own `<Suspense>` and `<ErrorBoundary>` (the latter is
  satisfied at the router level by `RouteErrorBoundary`).
- `.agent/workflows/state.md` — server data (and its loading/error
  state) is owned by TanStack Query.
