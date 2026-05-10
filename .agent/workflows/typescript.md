---
description: TypeScript conventions — strictness, type vs interface.
---

# TypeScript

## 1. Strictness

- `strict: true` is non-negotiable.
- NEVER use `any`. Use `unknown` and narrow.
- NEVER use `@ts-ignore`. `@ts-expect-error` is acceptable only with a one-line reason comment.
- Prefer `satisfies` over `as`.
- Avoid `!` (non-null assertion) unless structurally guaranteed and documented.

## 2. `type` vs `interface`

- `interface` for public object shapes (component props, service inputs).
- `type` for unions, intersections, mapped/conditional types, tuples.
- Component props: `interface {Component}Props { ... }`.

## 3. When to use Zod

Zod is for **form validation only** — the `react-hook-form` + `zodResolver` combo.
See `forms.md` for schema placement and the canonical pattern.

For everything else (API response types, request bodies, query params, domain
entities), use plain TypeScript `interface` or `type`. Do NOT create a Zod
schema just to derive a type with `z.infer` — write the interface directly.

## 4. Imports

- Always absolute via alias (`apis/`, `components/`, `pages/`). No `./` or `../`.
- Order: node built-ins → external → absolute internal → type-only last.
- Use `import type` for type-only imports.

## 5. Narrowing

Prefer discriminated unions over optional grab-bags.

Good:

```ts
type Result = { status: 'success'; data: Project } | { status: 'error'; error: string };
```

Bad:

```ts
type Result = { data?: Project; error?: string };
```
