---
description: Tailwind v4 — repo-specific setup and where to look up the API.
---

# Tailwind CSS v4

This repo is on Tailwind v4 via the `@tailwindcss/vite` plugin. This
file does **not** mirror the Tailwind reference. For the full API:

- `tailwindcss.com` — official docs.
- **Context7 MCP** — `resolve-library-id "tailwindcss"` then
  `query-docs`. v4 changed enough that older mental models drift —
  fetch the docs rather than guessing utility names from memory.

The day-to-day styling rules (use of `cn()`, semantic tokens, no
className variables, no arbitrary values when a token exists) live in
`components.md` §7. This file covers only the v4 setup specifics.

## 1. Setup in this repo

- Plugin: `@tailwindcss/vite` registered in `vite.config.ts`.
- Entry stylesheet: `src/index.css` with `@import "tailwindcss";` and
  the `@theme inline` block for design tokens.
- **No `tailwind.config.js`** and **no `postcss.config.js`**. v4 is
  CSS-native; configuration lives in `src/index.css`.
- `prettier-plugin-tailwindcss` is enabled; it sorts utility classes
  on save. Don't fight the order it produces.

## 2. Design tokens

Tokens are CSS custom properties inside `@theme inline` in
`src/index.css`. Tailwind generates utilities from them automatically
(e.g. declaring `--color-primary` produces `bg-primary`,
`text-primary`, …).

Conventions:

- **Brand**: `--brand-primary`, `--brand-secondary`, … (extend as
  needed).
- **Status**: `--status-success`, `--status-warning`, `--status-error`,
  `--status-info`.
- **Surfaces / chrome**: define tokens for what the project needs
  (e.g. `--panel`, `--muted`, `--sidebar-bg`).
- **Prefer semantic utilities** (`bg-primary`, `text-muted-foreground`)
  over raw color names (`bg-blue-500`) whenever a token exists.

## 3. Light / dark theme

- Theme is a className on `document.documentElement`: `"light"` |
  `"dark"`. The toggle is owned by `ThemeToggleButton` in
  `src/components/ui/custom/`.
- Don't write manual `dark:` color variants when a semantic token
  already adapts to mode (each token has a value per theme block).

## 4. Cross-references

- Day-to-day styling rules: `components.md` §7.
- shadcn primitives + wrap-don't-override pattern: `shadcn.md`.
- Loading & error UI patterns: `loading-states.md`.

## 5. References

- Tailwind v4 docs — https://tailwindcss.com
- v3 → v4 migration — https://tailwindcss.com/docs/upgrade-guide
- Context7: `resolve-library-id "tailwindcss"` for live docs
