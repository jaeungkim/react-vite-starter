---
description: Domain-first folder structure guidance for co-location and shared-code promotion.
---

# Domain-First Folder Structure Policy

## 1. Principle

Prefer domain-first co-location.

- Keep code close to the domain that owns it.
- Promote to shared/global only after real cross-domain reuse.

## 2. Root-Level Directory Map

```text
src/
├── apis/           # API layer: HTTP clients, query factories, types (see api.md)
├── components/     # Shared/reusable UI components used across 2+ domains
├── hooks/          # Shared custom hooks used across 2+ domains
├── lib/            # Pure utilities (cn(), formatters, helpers)
├── pages/          # Route entry-point components — one folder per route/domain
├── stores/         # App-wide Zustand stores (see state.md)
├── test/           # Test infrastructure (setup, render helpers, mocks)
├── types/          # Shared TypeScript types used across 2+ domains
├── App.tsx         # Root layout component (Header + Outlet)
├── router.tsx      # Route definitions (createBrowserRouter)
├── main.tsx        # Vite entry point (providers + RouterProvider)
└── index.css       # Global styles and Tailwind directives
```

Only create directories that the project actually needs. Do not scaffold
empty folders.

## 3. Scale Guidance

Not every project needs deep nesting. Match structure to project size.

| Project scale | Structure |
| --- | --- |
| Small (single page/domain, under ~15 components) | Flat `src/components/` with shared hooks/types at root level is fine |
| Medium (2-3 domains/routes, 15-40 components) | Introduce `src/pages/<domain>/` with domain-local sub-folders |
| Large (4+ domains, 40+ components, distinct feature modules) | Full domain-first + `features/` pattern inside complex domains |

When in doubt, start flat. Refactor into domain folders when navigating
the flat structure becomes painful or when cross-domain imports start
appearing.

### Per-Folder Threshold for Component Grouping

Within a single component folder, regroup into per-family subfolders when EITHER:

- The folder holds 8+ files, OR
- A single component family (component + test + skeleton + error/empty states)
  reaches 3+ files.

This keeps the "start flat" default while giving an unambiguous trigger for
when cohesion outweighs flatness. Do not pre-create empty family folders in
anticipation of growth — wait for the threshold.

When you do regroup, name child files after the family they belong to so the
file name communicates ownership without needing the folder context (e.g.,
`ContentCardSkeleton.tsx` inside `ContentCard/`, not bare `Skeleton.tsx`;
`ContentsListEmpty.tsx` inside `ContentsList/`, not bare `Empty.tsx`).

## 4. Definitions

- **Domain folder**: a route or feature boundary such as `src/pages/<domain>/`.
- **Shared/global folder**: root-level folders like `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/stores/`.

## 5. Placement Rules

- If code is used by **one domain**, keep it inside that domain folder.
- If code is used by **2+ domains**, promote it to the corresponding shared/global folder.
- Do not place single-domain code in root-level shared folders.

## 6. Domain Folder Template (`pages/`)

`src/pages/<domain>/` holds route entry-point components and their
domain-local code. Use only what the domain needs; do not scaffold empty
folders.

Optional shape:

- `src/pages/<domain>/components/`
- `src/pages/<domain>/features/` (for complex domains with distinct sub-features)
- `src/pages/<domain>/constants/`
- `src/pages/<domain>/hooks/`
- `src/pages/<domain>/types/`
- `src/pages/<domain>/utils/`
- `src/pages/<domain>/stores/`
- `src/pages/<domain>/schemas/`

### The `features/` Sub-Directory Pattern

For simple domains, grouping by type (`components/`, `hooks/`, `types/`)
at the domain root is sufficient. For complex domains with heavy,
distinct sub-features, adopt a `features/` folder inside the domain.

**Exception for Nested Component Logic:**
If a complex UI component requires its own isolated hooks, utilities, or
types that are **not shared anywhere else**, nest those directories
directly adjacent to the component within `components/`, rather than
forcing a heavy `features/` extraction.

Example:

```text
src/pages/complex-domain/
├── features/
│   ├── diagram/
│   │   ├── components/
│   │   │   └── complex-node/
│   │   │       ├── ComplexNode.tsx
│   │   │       └── hooks/              <-- Allowed! Only used by complex-node
│   │   ├── hooks/                      <-- Shared across diagram feature
│   │   └── types/
│   └── settings/
├── components/ # Shared UI across features in this domain
├── hooks/      # Shared hooks across features in this domain
```

## 7. Root-Level Shared Directories

These directories hold code promoted from domain folders after real
cross-domain reuse, or infrastructure that is inherently app-wide.

| Directory | Purpose | Governed by |
| --- | --- | --- |
| `src/apis/` | HTTP clients, query/mutation factories, API types | `api.md` |
| `src/components/` | Reusable UI components (used by 2+ domains) | `components.md` |
| `src/hooks/` | Reusable custom hooks (used by 2+ domains) | — |
| `src/lib/` | Pure utilities (`cn()`, formatters, helpers) | — |
| `src/stores/` | App-wide Zustand stores (`use{X}Store.ts`) | `state.md` |
| `src/test/` | Test setup, custom render, shared mocks | — |
| `src/types/` | Shared TypeScript types (domain-agnostic) | — |

`apis/` is **always** at the root level regardless of project scale — API
code is grouped by resource domain, not by page. See `api.md` for its
internal structure.

## 8. Import Boundary Guidance

- Domain code must not depend on another domain's internal folders.
- Cross-domain reuse should flow through shared/global folders.
- If two domains need the same logic, extract once to shared/global.

## 9. Barrel and `index` Files

- Avoid unnecessary `index`/barrel files.
- Add a barrel only when it clearly improves API clarity or import
  ergonomics.
- `apis/{domain}/index.ts` barrels are standard (see `api.md`).

## 10. Test File Placement

Co-locate test files next to the source they test. Tests follow
the same domain-first principle as all other code.

- **Unit / component tests**: place `ComponentName.test.tsx` in the
  same directory as `ComponentName.tsx`. The test file inherits the
  domain of its source — if the source is domain-local, the test is
  too.
- **Test infrastructure**: shared setup files, custom render helpers,
  global mocks, and fixtures live in `src/test/`. This directory is
  for reusable plumbing, not for actual test cases.
- **Do NOT** create a top-level `__tests__/` or `tests/` directory
  that mirrors the source tree. Co-location makes tests discoverable,
  keeps imports short, and ensures deleting a component deletes its
  test.
- **Integration / E2E tests** (if added later) may live in a
  project-root `e2e/` directory outside `src/`, since they span
  multiple domains by nature.

## 11. Placement Examples

Good:

- `src/pages/dashboard/hooks/useDashboardFilters.ts` (dashboard-only hook)
- `src/pages/store/utils/formatPrice.ts` (store-page-only util)
- `src/hooks/useDebounce.ts` (used across multiple domains)
- `src/stores/useFilterStore.ts` (app-wide Zustand store)

Bad:

- `src/components/WidgetX.tsx` when used by only one domain
- `src/hooks/useDashboardFilters.ts` when only dashboard uses it
- `src/pages/a/hooks/useSharedThing.ts` imported directly by `src/pages/b/*`
- `src/store.tsx` (singular file at root — use `src/stores/use{X}Store.ts`)

## 12. Migration Policy

This policy is guidance, not a forced repo-wide migration.

- No mandatory one-time cleanup.
- Apply on new work and touched files when practical.
- If existing structure is stable and untouched, do not refactor only to
  satisfy this policy.
