---
description: Custom hook rules — SRP-first design, anti-patterns, splitting strategy.
---

# Hooks

## 0. Design philosophy

> **One hook, one reason to change.**

Hooks are the primary unit of logic reuse in React. Apply the Single
Responsibility Principle rigorously:

- **Split by domain/responsibility**, not by technical category. A hook
  that manages `keyword`, `sort`, `dateRange`, and `pricing` is four
  hooks, not one.
- **A hook named after a page is a code smell.** `usePageState`,
  `useStorePage`, `useEverything` — these grow unbounded because their
  scope is "whatever this page needs." Name hooks after the *concern*
  they own: `useSearchKeyword`, `useSortOption`, `usePriceRange`.
- **Keep consumer re-renders narrow.** A mega-hook forces every consumer
  to re-render when *any* managed value changes. Focused hooks let each
  consumer subscribe only to what it uses.

Cross-ref: `frontend-fundamentals.md` Rules 1.3, 4.1 and the SOLID table.

## 1. Naming

- Must start with `use`.
- `use{Thing}` for state/behavior hooks.
- `use{Domain}{Thing}Query` / `use{Domain}{Thing}Mutation` for TanStack Query wrappers (see `api.md`).

## 2. Scope & placement

- Domain-local: `pages/{domain}/hooks/` or `features/{feature}/hooks/`.
- App-wide: `src/hooks/`.
- Placement rules in `folder.md` §3 apply: single-domain stays local, 2+ domains promotes to shared.

## 3. Inline vs extract

Inline when:

- Used in exactly one place AND ≤ 5 lines of logic.

Extract when:

- Used in 2+ places, OR
- Contains non-trivial logic (derived state, subscriptions, async).

**Multi-concern rule:** if a hook would manage 2+ *unrelated* state
variables (e.g., keyword + sort + pricing), it should be 2+ hooks
regardless of line count. Relatedness = "do they always change together?"

## 4. Rules reminders

- Never call hooks conditionally or inside loops.
- Never call hooks from regular functions; only from components or other hooks.
- Memoize returned functions/objects only when a child relies on referential
  equality (e.g., it is wrapped in `React.memo`, or the reference appears in
  a dependency array). Do not memoize by default — see `components.md` §9.

## 5. Return shape

- Object when 3+ values or callers typically take a subset.
- Tuple when order is semantic and at most 2 values (like `useState`).

```ts
const { data, isLoading, error, refetch } = useProjects();
const [isOpen, setIsOpen] = useDisclosure();
```

## 6. Anti-patterns

### Mega hook

A single hook that owns every query parameter (or every piece of state)
for a page. It grows unbounded, couples unrelated consumers, and causes
unnecessary re-renders.

```ts
// ❌ One hook owns everything — unbounded scope
export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam,
  });
  return useMemo(() => ({
    values: { /* parse all */ },
    controls: { /* setters for all */ },
  }), [query, setQuery]);
}

// ✅ One hook per concern — focused, independently consumable
export function useCardIdParam() { /* ... */ }
export function useDateRangeParam() { /* ... */ }
export function useStatusListParam() { /* ... */ }
```

### God hook

A hook that fetches data, transforms it, manages local state, AND
handles side effects. It violates SRP and hides logic (Rule 2.3).

```ts
// ❌ fetch + transform + local state + side effect
function useUserDashboard() {
  const { data } = useQuery(userQueries.detail(id));
  const [tab, setTab] = useState('overview');
  useEffect(() => { analytics.pageView('dashboard'); }, []);
  const stats = useMemo(() => computeStats(data), [data]);
  return { data, tab, setTab, stats };
}

// ✅ Separate concerns
// Query: use userQueries.detail(id) directly in the component
// Tab: const [tab, setTab] = useState('overview');
// Analytics: usePageView('dashboard');  (or inline in component)
// Stats: const stats = useMemo(() => computeStats(data), [data]);
```

### Kitchen-sink return

Returning 8+ values from a single hook is a signal the hook is doing
too much. Split into smaller hooks that each return 2–4 related values.

## 7. Splitting strategy

### URL params

One hook per logical filter concern. Shared constants and validation
helpers can live alongside the hooks in the same file.

Canonical example in this repo: `pages/store/hooks/useFilterParams.ts`
exports `useSearchKeyword`, `usePricingOptions`, `usePriceRange`,
`useSortOption`, and `useResetFilters` — each independently consumable.

### Data fetching

Query factories live in `apis/{domain}/`. Components consume them
directly via `useQuery(domainQueries.list(params))`. Do not wrap
`useQuery` in a custom hook unless the hook adds meaningful derived
state or side-effect coordination.

### Side effects

- **Event-driven** (click, submit): inline in the handler or extract
  the handler + trigger into a sub-component.
- **Mount/lifecycle** (analytics, subscriptions): a small dedicated
  hook (`usePageView`, `useWebSocket`) — never bundled with data access.

## 8. Documentation

### Global hooks (`src/hooks/`)

Every exported hook in `src/hooks/` must have a JSDoc block with:

- **Summary** — one-line description of what the hook does
- **`@param`** — each parameter with type context and purpose
- **`@returns`** — what the return value is (especially when non-obvious, e.g., a ref callback vs a ref object)
- **`@example`** — minimal usage snippet

Domain-local hooks (`pages/{domain}/hooks/`) do not require JSDoc unless
the hook is complex enough that its name + signature are insufficient.

Comments must be in English.
