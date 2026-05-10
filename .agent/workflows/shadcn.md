---
description: shadcn/ui rules — local default/, wrap in custom/.
---

## 1. Where primitives live

- `src/components/ui/default/` — vendored shadcn primitives.
  Naming: kebab-case (`button.tsx`, `dropdown-menu.tsx`).
  **Treat as immutable vendor code.**
- `src/components/ui/custom/` — app-specific wrappers built from
  `default/` primitives. Naming: PascalCase (`ThemeToggleButton.tsx`).

## 2. Adding a new primitive

- First check `src/components/ui/default/` — most are already there.
- If missing, install via the shadcn package (`shadcn` is in
  dependencies). Add the new file to `default/`, not `custom/`.
- Never hand-roll a Radix wrapper that shadcn already provides.

## 3. Wrap, don't override (HARD RULE)

Do NOT edit files in `src/components/ui/default/` to change padding,
margin, borders, colors, typography, or layout. The vendored copy must
stay close to the shadcn baseline so future CLI updates and team-wide
consistency stay intact.

When you need something visually or behaviourally different:

```tsx
// ❌ Editing the vendor primitive
// src/components/ui/default/button.tsx
<button className={cn('px-6 font-semibold', className)} ... />

// ✅ Wrapping in custom/
// src/components/ui/custom/PrimaryAction.tsx
import { Button, type ButtonProps } from 'components/ui/default/button';
import { cn } from 'utils/cn';

export function PrimaryAction({ className, ...props }: ButtonProps) {
  return <Button className={cn('px-6 font-semibold', className)} {...props} />;
}
```

The only edits permitted inside `default/` are upstream-style fixes
(typos, type errors) — not visual or behavioural customization.

## 4. Composition rules

- Custom components import from `components/ui/default/<name>` (alias).
- Preserve `data-slot` attributes when wrapping (shadcn v4 convention —
  enables external styling and querying).
- Use `class-variance-authority` (cva) for variants.
- Icons: `lucide-react` only.

## 5. Styling — see `components.md` §7

- Use `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge) for all
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
- `ThemeToggleButton` in `src/components/ui/custom/` owns the toggle.
- Never write manual `dark:` variants when a semantic token already
  adapts to mode.

## 7. Cross-references

- Component placement, props, structural rules: `components.md` §1–6.
- Tailwind / `cn` rules: `components.md` §7.
- Forms using shadcn primitives: `forms.md`.

## 8. References

- https://ui.shadcn.com/docs
- https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components
- https://ui.spectrumhq.in/blog/shadcn-customization-guide
