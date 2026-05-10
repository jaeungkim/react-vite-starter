---
description: Component authoring rules.
---

# Components

## 1. Placement

See `folder.md` for where component files live:

- Shared/reusable (used by 2+ domains): `src/components/`.
- Domain-local (used by one domain): `src/pages/<domain>/components/`.

## 2. File & export

- One component per file.
- Named function declaration: `export function UserCard() {}`.
- File name matches component name: `UserCard.tsx`.
- No default exports, except framework-required files (Next.js `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`).

## 3. Props

- Typed via `interface {Component}Props`.
- Destructure at the parameter position.
- Avoid prop-drilling beyond two levels. When drilling appears:
  1. **Composition first** — use `children` to let the parent render the
     leaf directly, eliminating the middleman component.
  2. **Context second** — if depth remains after composition, use a
     scoped Context Provider (see `state.md`).
  Cross-ref: `frontend-fundamentals.md` Rule 4.3.

## 4. UI vs logic split

- Presentational components: props in, JSX out. No side effects, no data fetching.
- Container / feature components: wire queries/mutations from `apis/` and pass data to presentational children.

### Separate code that does not run together

When a component branches on a condition (role, feature flag, status)
and the branches share no logic, split into child components dispatched
by a thin parent. This keeps each branch's context count low.

```tsx
// ❌ Interleaved branches in one body
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  useEffect(() => { if (!isViewer) showAnimation(); }, [isViewer]);
  return isViewer ? <TextButton disabled>Submit</TextButton> : <Button type="submit">Submit</Button>;
}

// ✅ One branch, one component
function SubmitButton() {
  return useRole() === 'viewer' ? <ViewerSubmit /> : <AdminSubmit />;
}
```

Cross-ref: `frontend-fundamentals.md` Rule 1.1.

### Extract imperative handler logic

When a click handler contains 10+ lines of dialog/overlay/confirm
logic, extract the trigger + handler as a self-contained sub-component.
This keeps the parent declarative and co-locates the trigger with its
effect.

```tsx
// ❌ 30-line confirm dialog logic inline in parent
function Page() {
  const handleInvite = async () => { /* open dialog, await result, send push... */ };
  return <Button onClick={handleInvite}>Invite</Button>;
}

// ✅ Sub-component owns its own interaction
function Page() {
  return <InviteButton name={data.name} />;
}
```

## 5. Single-use vs reusable

- A single-use structural UI component is STILL a separate file. See `behavior.md` §2.
- A single-use 1–5-line hook or util is inlined.

## 6. Composition over configuration

Good:

```tsx
<Card>
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
</Card>
```

Bad:

```tsx
<Card showHeader header={...} body={...} />
```

## 7. Styling

### Setup

- Tailwind CSS v4 is configured via the `@tailwindcss/vite` plugin — no
  `tailwind.config.js` or `postcss.config.js`.
- Custom design tokens (CSS variables) live in `src/index.css` `:root`.

### `cn()` is the only way to compose classNames

- Always use `cn()` from `lib/utils` for conditional or merged classes.
- Never use template literals, string concatenation, or manual ternaries
  inside `className`.

```tsx
// ✅
<div className={cn("flex items-center", isActive && "bg-primary text-primary-foreground")} />

// ❌ 템플릿 리터럴
<div className={`flex items-center ${isActive ? "bg-primary" : ""}`} />

// ❌ 문자열 연결
<div className={"flex items-center " + (isActive ? "bg-primary" : "")} />
```

### Keep class strings inline — no className variables

Do not extract Tailwind class strings into constants or variables.
Class strings are co-located styling; pulling them out forces the reader
to jump between definition and usage for zero reuse benefit.

```tsx
// ❌ Extracted into a variable
const CARD_STYLES = 'rounded-lg border bg-panel p-4';
<div className={cn('flex flex-col', CARD_STYLES)} />

// ✅ Inline where it's used
<div className={cn('flex flex-col rounded-lg border bg-panel p-4')} />
```

If the same classes appear on multiple elements in one component, that is
fine — duplication of a short class list within a single file is preferable
to indirection. If the pattern is truly reused across files, extract a
**component**, not a className variable.

### Prefer predefined Tailwind utilities over arbitrary values

Avoid arbitrary-value syntax (`[...]`) when Tailwind already provides a
utility or when the value can be added as a design token in
`src/index.css` `@theme`.

- **Spacing/sizing:** use the default scale (`p-4`, `gap-6`, `size-10`),
  not `p-[17px]` or `gap-[1.375rem]`.
- **Colors:** use semantic tokens (`bg-panel`, `text-muted`), not
  raw hex values via `bg-[#1e2126]` or `text-[#7f848d]`.
- **Gradients/backgrounds:** if a gradient is reused, register it as a
  CSS utility or token in `src/index.css` — do not inline
  `bg-[linear-gradient(...)]`.
- **Animations:** define keyframes and animation tokens in `@theme`,
  then reference the token class — do not hardcode timing or keyframe
  values via arbitrary properties.

Arbitrary values are acceptable only for truly one-off,
runtime-dependent, or design-spec values that have no Tailwind
equivalent and don't map to any existing scale.

### When `style={{}}` is acceptable

Use inline styles **only** for values Tailwind cannot express statically:

- **Runtime-computed values** — `style={{ width: `${percentage}%` }}`,
  `style={{ transform: `translateX(${x}px)` }}`.
- **CSS custom property overrides** scoped to one element —
  `style={{ '--chart-color': color } as React.CSSProperties}`.

Everything else uses Tailwind classes via `cn()`.

### When `style={{}}` is NOT acceptable

- Static values Tailwind can express (colors, spacing, font sizes, borders).
- Hover / focus / responsive / dark-mode — Tailwind variants handle these;
  inline styles cannot.
- Layout (`display`, `flex`, `grid`) that has direct Tailwind equivalents.

### Tailwind conventions

- Prefer `gap-*` over `space-x-*` / `space-y-*`.
- Prefer `size-*` over `w-* h-*` when width and height are equal.
- Prefer `truncate` over `overflow-hidden text-ellipsis whitespace-nowrap`.
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) over
  raw Tailwind colors (`bg-blue-500`) when design tokens are defined.
- No manual `dark:` color overrides when semantic CSS variable tokens are
  available — the tokens handle light/dark automatically.
- `className` on reusable components is for **layout** (spacing, sizing,
  positioning). Override colors/typography via variants or CSS variables,
  not className.
- No manual `z-index` on overlay components that manage their own stacking
  (Dialog, Sheet, Popover, etc.).

### Typography roles

These 8 inline class strings are the **only** typography combinations to use in
app code. Apply them verbatim with `cn()`. Do not extract them into utility
classes, CSS shortcuts, or wrapper components — the class string is the
documentation.

| Role | When to use | Class string |
|---|---|---|
| **page-title** | `<h1>` in `PageHeader`. One per route. | `text-xl font-semibold text-foreground` |
| **section-title** | Major in-page section header, modal/dialog title, `StepH1`. | `text-lg font-bold text-primary` |
| **card-title** | Sidebar header, in-card heading, wizard step group title. | `text-sm font-bold tracking-[.03em] text-primary` |
| **body** | Default content, list rows, table cells, menu items. | `text-sm text-foreground` (or `text-muted-foreground` when secondary) |
| **body-strong** | Emphasis inside body, KPI numbers, active tab label. | `text-sm font-bold text-foreground` |
| **caption** | Tab labels, PageBar parts, secondary metadata, dropdown labels, helper text. | `text-xs text-muted-foreground` (or `text-xs font-medium` for interactive labels like tabs) |
| **micro** | Tiny markers, status chips, in-cell indicators. The 11px floor. | `text-2xs font-bold` |
| **code-label** | Uppercase wide-tracked tags ("STEP 01", "ACTIVE", "PASS", "MORPH"). | `text-2xs font-bold tracking-[0.07em] uppercase` |

Color is composed inline (`text-status-warning`, `text-brand-progressive`, etc.)
via `cn()` — the role string carries size + weight + (sometimes) base color
only.

#### Typography anti-patterns

- ❌ Arbitrary pixel sizes: `text-[7px]`, `text-[8px]`, `text-[9px]`,
  `text-[11px]`. Always use a token from the canonical roles. The 11px
  micro role is the floor for app code.
- ❌ Tokens below the floor in app code: `text-3xs` (10px), `text-4xs` (9px),
  `text-5xs` (8px) remain in `index.css` as escape hatches but must not be
  used in `src/components/**` or `src/pages/**`.
- ❌ `cn-font-heading` and other phantom classes — every class in `cn()`
  must resolve to a real CSS rule.
- ❌ Re-stating a default in `className`: don't pass
  `className="text-base font-medium"` to `<DialogTitle>` — the canonical
  `section-title` is already the default. Override only layout
  (`flex`, `gap`, `min-w-0`).
- ❌ Defining a `<PageTitle>` / `<SectionTitle>` wrapper or a
  `.text-page-title` CSS shortcut — the inline string IS the contract.

## 8. Accessibility

- Every interactive element has an accessible name.
- `useId()` for form field ids — never `Math.random()` or counters.
- Do not override focus styles without a replacement.

## 9. Memoization

**Do not reach for `useMemo`, `useCallback`, or `React.memo` by default.**
Memoization is an optimization with real costs (readability, memory, stale-dep
bugs). Apply it only when you can name the specific problem it solves.

### When to memoize

- **`React.memo`** — a component re-renders frequently with the same props
  AND profiling shows it's expensive. Never preemptive.
- **`useMemo`** — the computation is genuinely expensive (large list
  transforms, complex derivations). Filtering/mapping a small array or
  formatting a string is NOT expensive.
- **`useCallback`** — the function is passed to a `React.memo`-wrapped child
  OR used in a dependency array where instability causes bugs (effect loops).

### When NOT to memoize

- Inline event handlers on native elements (`onClick`, `onChange`) — React
  handles these efficiently; wrapping in `useCallback` adds noise for zero gain.
- Cheap derivations (string concat, simple `.map`/`.filter` on small arrays).
- Functions that are not passed as props to memoized children.
- "Just in case" or "it can't hurt" — it can hurt readability, which this
  repo values higher than micro-optimization.

### The test

Before adding `useMemo`/`useCallback`, answer: "What re-render or
recomputation does this prevent, and is that recomputation actually
expensive?" If you cannot answer concretely, do not memoize.
