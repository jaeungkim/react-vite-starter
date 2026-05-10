---
description: shadcn/ui rules — flat src/components/ui/, copy & own.
---

## 1. Where primitives live

- `src/components/ui/` — shadcn primitives, flat. Kebab-case filenames
  (`button.tsx`, `dropdown-menu.tsx`) — matches what `npx shadcn add`
  emits.
- Treat them as **your code**: edit freely, extend variants, rename
  exports. The shadcn philosophy is copy & own — not vendor-lock.

## 2. Adding a primitive

- The starter pre-installs a common kit: `button`, `input`, `label`,
  `form`, `card`, `dialog`. Pull anything else on demand:

  ```sh
  npx shadcn@latest add <name>
  ```

- Files land in `src/components/ui/<name>.tsx` (the `@/*` alias is
  configured in both `tsconfig.json` and `tsconfig.app.json`).
- If a primitive isn't in the registered style (`radix-nova` per
  `components.json`), copy from https://ui.shadcn.com/docs/components
  and adapt — don't hand-roll a Radix wrapper from scratch.

## 3. Editing primitives

- Edit them when you need to. If a variant is reusable, prefer adding
  it to the existing `cva(...)` config over forking the file or
  wrapping it.
- For one-off styling tweaks at a call site, pass `className` —
  `cn()` merges it correctly.

## 4. Composition rules

- Preserve `data-slot` attributes when wrapping or extending (shadcn
  v4 convention — enables external styling and querying).
- Use `class-variance-authority` (cva) for variants.
- Icons: `lucide-react` only.

## 5. Styling — see `components.md` §7

- Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for all
  class composition. Do not use template literals or string
  concatenation.
- Design tokens live in `src/index.css` inside `@theme inline`.
- Define your own brand and status tokens (e.g. `--brand-primary`,
  `--brand-secondary`, `--status-success`, `--status-warning`) and
  reference them via semantic Tailwind utilities (`bg-primary`,
  `text-muted-foreground`) rather than raw colors.
- Tailwind v4 is configured via `@tailwindcss/vite` — no
  `tailwind.config.js`.

## 6. Theming (light / dark)

- Theme is a className on `document.documentElement`: `"light"` |
  `"dark"`.
- Never write manual `dark:` variants when a semantic token already
  adapts to mode.

## 7. Cross-references

- Component placement, props, structural rules: `components.md` §1–6.
- Tailwind / `cn` rules: `components.md` §7.
- Forms using shadcn primitives: `forms.md`.

## 8. References

- https://ui.shadcn.com/docs
