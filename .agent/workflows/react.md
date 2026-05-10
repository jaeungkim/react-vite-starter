---
description: React 19 — repo-specific rules and where to look up the API.
---

# React

This repo uses React 19 with Vite + TypeScript. We do **not** mirror
the React API reference here. There are fresher sources:

- `react.dev` — official docs.
- **Context7 MCP** — `resolve-library-id "react"` then `query-docs`.
  Prefer this over guessing from training-data memory; it pulls
  current docs.

When you need to know how a hook works or what's new in React 19,
fetch the docs. When you need to know how *this repo* uses React, the
rules below apply.

## 1. Where the repo's React rules live

- `components.md` — placement, props, composition, memoization (§9),
  styling (§7).
- `hooks.md` — custom-hook design (SRP, splitting, anti-patterns).
- `state.md` — when to reach for `useState` vs `useReducer` vs Context
  vs Zustand vs TanStack Query.
- `loading-states.md` — `Suspense`, error boundaries, loading
  primitives.
- `react-router.md` — route components and the router-level error
  boundary.

## 2. React 19 idioms this repo uses

- **Functional components only.** No class components.
- **`useId()` for form-field ids** — never `Math.random()` or
  hand-rolled counters. See `components.md` §8.
- **Refs as first-class.** `useRef` for DOM nodes and for cross-render
  mutable values that should NOT trigger a re-render. Anything visible
  in render goes in state.
- **Effects are an escape hatch.** Most "I need an effect for this"
  cases are better solved by:
  - server state → TanStack Query (`state.md` §1)
  - derived state → compute during render (no effect needed)
  - event-driven side effects → handle in the event handler

## 3. Non-negotiables

- **Don't mutate state.** Always replace.
- **Don't call hooks conditionally** or inside loops, callbacks, or
  nested functions. Top-level only.
- **Don't reach for `useMemo` / `useCallback` / `React.memo` by
  default.** `components.md` §9 has the test for when to add them.
- **Don't copy server data into local state.** TanStack Query owns it.
  See `state.md` §1.

## 4. References

- React 19 docs — https://react.dev
- React 19 release notes — https://react.dev/blog/2024/12/05/react-19
- Context7: `resolve-library-id "react"` for live docs
