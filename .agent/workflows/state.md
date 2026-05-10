---
description: Where state lives — decision matrix, TanStack Query, Context & Zustand patterns.
---

# State Placement

Decide by origin, not convenience.

| Kind                                        | Tool                                 |
| ------------------------------------------- | ------------------------------------ |
| Server data (from an API)                   | TanStack Query                       |
| URL-shareable state                         | `useSearchParams` / URL params — one hook per logical concern (see `hooks.md` §0) |
| Form state                                  | react-hook-form                      |
| Ephemeral UI (open/closed, hover)           | `useState` / `useReducer` local      |
| Infrequently changing globals (auth, theme, i18n) | React Context                   |
| Complex client state shared across domains  | Zustand store                        |

---

## Server state — TanStack Query

> Server state is fundamentally different from client state. It is persisted
> remotely, owned by many users, and can become stale without your knowledge.

Any data that originates from an API belongs to TanStack Query. The query
cache is the **single source of truth** — never copy it into `useState`,
Zustand, or Context.

### Why a dedicated server-state layer matters

Without TanStack Query you end up writing `useState` + `useEffect` fetch
boilerplate in every component: manual loading/error flags, no caching, no
deduplication, no background refetch, and race conditions on unmount. TanStack
Query eliminates all of this.

### What TanStack Query handles automatically

| Concern | How |
| --- | --- |
| Caching | Keyed by `queryKey`; configurable `staleTime` and `gcTime` |
| Background refetch | Stale data is re-fetched on window focus, reconnect, or interval |
| Request deduplication | Multiple components using the same `queryKey` share one in-flight request |
| Loading / error / success states | Returned as `{ data, isLoading, isError, error }` — no manual flags |
| Optimistic updates | Via `onMutate` + rollback in `onError` |
| Pagination & infinite scroll | `useInfiniteQuery` with `getNextPageParam` |
| Cache invalidation | `queryClient.invalidateQueries()` by key hierarchy |

### Consumption pattern

```ts
// ✅ Use query options directly in the component
const { data, isLoading } = useQuery(projectQueries.list(params));

// ✅ Derive values from the returned data
const activeCount = data?.items.filter((p) => p.active).length ?? 0;
```

```ts
// ❌ Copying server data into useState — never do this
const [projects, setProjects] = useState([]);
useEffect(() => {
  fetchProjects().then(setProjects);
}, []);
```

### Key rules (quick reference)

- Use `queryOptions()` factories in `apis/{domain}/{domain}.queries.ts` —
  never hardcode `queryKey` arrays inline. See `api.md` §3 for the full
  query key factory pattern.
- Mutations live in `apis/{domain}/{domain}.mutations.ts` and invalidate
  the narrowest query key scope that covers what changed.
- Derived/computed values from server data are calculated from `data` at
  render time — do not store them separately.
- For full implementation details (file structure, templates, typing rules),
  see `api.md`.

---

## Context API vs Zustand — when to use which

Two factors decide: **how often the value changes** and **how it's consumed**.

| Situation | Pick | Why |
| --- | --- | --- |
| Auth session, theme, locale, i18n | Context | Changes infrequently; Context is the standard React pattern for dependency injection of app-wide concerns |
| Domain-scoped shared state (wizard steps, panel filters) | Context | Scoped Provider keeps the dependency explicit and deletable with the feature |
| Client state shared across different domains and updated frequently (cart, notifications, complex multi-panel UI) | Zustand | Subscription-based — only consumers of the changed slice re-render; no Provider needed |
| Frequently changing values (drag position, animation frame, timers) | Zustand or local `useState` | Context re-renders the entire subtree on every change |
| State that must survive page reload | Zustand `persist` middleware | Built-in `localStorage`/`sessionStorage` support |
| State accessed outside React (API interceptors, utility functions) | Zustand | `getState()` / `setState()` callable from non-React code |

**When in doubt:** start with Context for infrequently changing globals;
reach for Zustand when you hit performance issues, need access outside
React, or the state is genuinely complex client-side state shared across
multiple domains.

---

## Context API conventions

> Context is a **transport mechanism** (dependency injection), not a state
> manager. It moves values through the tree — it does not decide how state
> changes or when updates happen.
> — [react.dev](https://react.dev/learn/passing-data-deeply-with-context)

### Guidelines

- **Strict context + custom hook** — always wrap `useContext` in a
  `use{X}Context()` hook that throws if the Provider is missing. Export
  the hook as the public API; consumers never import the raw Context
  object directly.
- **Provider placement** — app-wide concerns (auth, theme, i18n) wrap
  the app at the root. Domain-specific contexts wrap only their subtree,
  as close to consumers as possible.
- **Stabilize provider values** — wrap object values in `useMemo` and
  callbacks in `useCallback` to avoid accidental re-renders from new
  references on every render.
- **Split state and dispatch** — if consumers that only call actions
  (dispatch) are re-rendering on state changes, split into two separate
  contexts (one for state, one for dispatch).
- **`useReducer` + Context** — when the domain has multiple related
  state transitions, pair `useReducer` with Context instead of multiple
  `useState` calls. Keeps transitions predictable and testable.

---

## Zustand conventions

> Ref: [Zustand Beginner TypeScript Guide](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript)

Use Zustand for complex client-side state that updates frequently, is
consumed across multiple domains, or needs features Context doesn't
provide (persistence, outside-React access, subscription-based rendering).

### File placement & naming

- App-wide: `src/stores/use{X}Store.ts`
- Domain-scoped (rare): `pages/{domain}/stores/use{X}Store.ts`
- File and hook export share the same name: `use{X}Store`.
- One store per file.

### Guidelines

- **Curried `create` with explicit interface** — separate state and
  actions into distinct interfaces, then combine. Use `create<T>()(…)`
  for proper TypeScript inference.
- **Selectors** — always pass a selector `(s) => s.field` to subscribe
  to the narrowest slice. Never consume the whole store without a selector.
- **`useShallow`** — when a selector returns an object or array, wrap it
  with `useShallow` from `zustand/react/shallow` to avoid re-renders from
  new references. See [Prevent rerenders with useShallow](https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow).
- **Derived state** — compute values inside selectors instead of storing
  redundant fields (e.g., `(s) => s.items.length`).
- **Reset pattern** — extract `initialState` as a const so reset/clear
  actions can call `set(initialState)`.
- **Slices pattern** — when a store grows beyond ~5 fields, split into
  `StateCreator` slice functions combined in one bounded store. Each
  slice in its own file. Apply middleware only on the combined store,
  never inside individual slices. See [Slices Pattern](https://zustand.docs.pmnd.rs/learn/guides/slices-pattern).
- **Middleware** — use `persist` for state surviving page reloads (with
  `partialize` to select what to persist), `devtools` for development
  debugging, `immer` for deeply nested immutable updates. All from
  `zustand/middleware`.
- **Actions outside React** — store actions are callable from utils,
  interceptors, and non-React code via `getState()` / `setState()`.
  This is a key advantage over Context.

---

## Anti-patterns

| Anti-pattern | Why it's harmful | Do this instead |
| --- | --- | --- |
| `useState` + `useEffect` for API data | No caching, no dedup, race conditions, manual loading/error flags | TanStack Query `useQuery` / `useMutation` |
| Mirroring server data into Zustand/Context | Two sources of truth; stale data bugs | TanStack Query cache is the single source |
| God-store (`useAppStore` with everything) | Every consumer re-renders on any change | One store per domain (`useCartStore`, `useNotificationStore`) |
| Bare `useContext()` without wrapper hook | Silent `undefined` at runtime; no error boundary | Always `use{X}Context()` with a throw guard |
| Context for high-frequency values | Full subtree re-render on every change | Zustand (subscription-based) or local `useState` |
| Zustand for auth/theme when Context suffices | Unnecessary dependency; breaks convention | Use Context for infrequently changing globals |
| Defining stores inside components | Store re-created every render; data lost | Always define at module scope |
| Whole-store consumption (`useStore()` with no selector) | Every field change triggers a re-render | Always pass a selector `(s) => s.field` |
| Object/array selector without `useShallow` | New reference every call → unnecessary re-renders | Wrap with `useShallow` for shallow comparison |
| God-hook for URL params (`usePageState` managing every search param) | Unbounded scope, all consumers re-render on any param change, violates SRP | Split into one hook per concern (see `hooks.md` §0) |

---

## Rules

- Server data is ALWAYS TanStack Query's. Never mirror it into `useState`,
  Zustand, or Context.
- Auth, theme, and i18n use Context by default — the standard React pattern.
- Zustand is for complex, frequently updating client state shared across
  domains, or when you need persistence / outside-React access.
- State that should survive share/reload goes in the URL.
- No Redux in new code unless the user explicitly requests it.
