---
description: The 4 principles (readability, predictability, cohesion, coupling) and SOLID mapping — the decision framework when no mechanical rule applies.
---

# Frontend Fundamentals — Guidelines for AI Agents

> **Purpose:** A rule-set an AI coding agent should load into context when writing, reviewing, or refactoring frontend code (React/TypeScript focus, but principles generalize).
> Inspired by [frontend-fundamentals.com](https://frontend-fundamentals.com/code-quality/code/).

---

## 0. Core Philosophy

**Good frontend code is code that is easy to modify.** Every suggestion, refactor, or new piece of code should be judged against four criteria:

1. **Readability** — How quickly can another person understand this?
2. **Predictability** — Can behavior be guessed from name, params, return type alone?
3. **Cohesion** — Do things that change together live together?
4. **Coupling** — When this changes, how wide is the blast radius?

### The Central Trade-off (read this first)

These four principles can conflict. You cannot maximize all of them simultaneously.

- Raising cohesion (abstracting shared logic) often **reduces** readability.
- Lowering coupling (allowing duplication) often **reduces** cohesion.
- Therefore: **do not mechanically apply a rule** — weigh which principle matters most for the specific change being made. Prefer cohesion when not changing together causes real bugs; prefer readability when the risk is low.

### Cognitive Load Ceiling

Code is like natural language — every concept should be named at the right
level of detail. "Walk 10 steps left" is clear because *left*, *steps*, and
*walk* are abstractions we share. Spelling out the physics each time would be
unreadable. But inventing an abstraction nobody asked for is equally harmful.

A reader's working memory holds **~6 concepts** at a time ([*The Programmer's
Brain*](https://www.yes24.com/product/goods/105911017)). If a function,
component, or hook requires holding more than 6, break it down. If your
"improvement" adds more indirection than it removes, stop.

### SOLID Principles in React

| Principle | In Practice |
| --- | --- |
| **SRP** — Single Responsibility | One hook = one concern. One component = one reason to change. A hook named after a page (`usePageState`) is a code smell. |
| **OCP** — Open/Closed | Extend via composition (`children`, slots) not by adding config props. See `components.md` §6. |
| **LSP** — Liskov Substitution | Same-category hooks return the same shape (Rule 2.2). Swapping one for another should not surprise. |
| **ISP** — Interface Segregation | Small, focused prop interfaces. No god-props (`PageProps` with 15 fields). Split into composable pieces. |
| **DIP** — Dependency Inversion | Depend on abstractions: query factories (`apis/`), context hooks (`use{X}Context`), not on concrete fetch calls or raw stores. |

### How the Agent Should Use This Document

- Before proposing a refactor, name which of the 4 principles it improves and which it may hurt.
- When a user's code violates a rule, quote the specific rule number (e.g., "Rule 1.4") and give the minimal fix.
- Do **not** over-abstract. A reader should juggle ~6 contexts at most at one time. If your "improvement" adds more, stop.

---

## 1. Readability

Readable code has **few contexts** to hold at once and **flows top-to-bottom**.

### 1.A Reducing Context

#### Rule 1.1 — Separate code that does not run together

If two branches of a component never execute simultaneously (e.g., `viewer` vs `admin`), do not intermix them in one body. Split into two components and dispatch once at the top.

```tsx
// ❌ Mixed contexts inside one component
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  useEffect(() => {
    if (isViewer) return;
    showButtonAnimation();
  }, [isViewer]);
  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}

// ✅ One branch, one component
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}
```

#### Rule 1.2 — Abstract implementation details

Side concerns (auth checks, redirects, analytics setup) should not sit inline in the main component body. Lift them into a **wrapper component** or **HOC** so the primary component only holds its core logic.

```tsx
// ✅ Auth concern extracted to a guard
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}
```

Similarly: if a button's click handler contains 30 lines of dialog/confirm logic, extract the button + its handler into its own component. This also improves cohesion (the click target and its effect sit next to each other).

#### Rule 1.3 — Split functions/hooks grouped only by "logic type"

Hooks like `usePageState()` that manage **every** query param, or a `useStore()` that owns every piece of state, grow unbounded and force consumers to re-render on unrelated changes. Split by **domain/responsibility**, not by technical category.

```ts
// ❌ One hook owns everything
export function usePageState() {
  /* cardId, dateFrom, dateTo, statusList... */
}

// ✅ One hook per concern
export function useCardIdQueryParam() {
  /* ... */
}
export function useDateRangeQueryParam() {
  /* ... */
}
```

### 1.B Naming

#### Rule 1.4 — Name complex conditions

Extract multi-part boolean expressions into named variables. Human working memory holds ~6 items; long predicates blow that budget.

```ts
// ❌
products.filter((p) =>
  p.categories.some(
    (c) =>
      c.id === targetCategory.id && p.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);

// ✅
products.filter((p) =>
  p.categories.some((c) => {
    const isSameCategory = c.id === targetCategory.id;
    const isPriceInRange = p.prices.some((price) => minPrice <= price && price <= maxPrice);
    return isSameCategory && isPriceInRange;
  })
);
```

**When to skip naming:** trivial one-liners used once (`arr.map(x => x * 2)`) do not need names.

#### Rule 1.5 — Name magic numbers

Any numeric literal whose meaning is not self-evident must become a named constant. `delay(300)` → `const ANIMATION_DELAY_MS = 300; delay(ANIMATION_DELAY_MS);`.

### 1.C Top-to-Bottom Reading

#### Rule 1.6 — Reduce eye movement

Prefer code a reader can scan linearly over code that forces jumps between a policy map → helper fn → component. For simple cases, inline the condition. Reserve abstraction (policy tables, permission maps) for genuinely complex cases.

```tsx
// ✅ Linear: read the component top-to-bottom, done.
switch (user.role) {
  case 'admin':
    return (
      <>
        <Button>Invite</Button>
        <Button>View</Button>
      </>
    );
  case 'viewer':
    return (
      <>
        <Button disabled>Invite</Button>
        <Button>View</Button>
      </>
    );
}
```

#### Rule 1.7 — Do not nest ternaries

Replace nested `? :` chains with an IIFE of early-returning `if` statements.

```ts
// ❌
const status = A && B ? 'BOTH' : A || B ? (A ? 'A' : 'B') : 'NONE';

// ✅
const status = (() => {
  if (A && B) return 'BOTH';
  if (A) return 'A';
  if (B) return 'B';
  return 'NONE';
})();
```

#### Rule 1.8 — Write range comparisons left-to-right

Mirror the mathematical form `min ≤ x ≤ max`. Do not repeat the middle term.

```ts
// ❌ if (score >= 80 && score <= 100)
// ✅ if (80 <= score && score <= 100)
```

---

## 2. Predictability

A function's name, parameters, and return type should fully imply its behavior. No surprises.

#### Rule 2.1 — Give distinct behaviors distinct names

If you wrap a library and add behavior (auth headers, caching, retries), do not shadow the library's name. `http.get` that secretly fetches a token is a trap. Rename to `httpService.getWithAuth`.

#### Rule 2.2 — Unify return types for same-category functions

All hooks that call APIs should return the same shape (e.g., always a `Query` object). All validation functions should return the same shape (e.g., always `{ ok: true } | { ok: false, reason: string }`).

```ts
// ❌ One returns the Query, the other unwraps .data — inconsistent
function useUser()       { return useQuery(...); }
function useServerTime() { return useQuery(...).data; }

// ✅ Both return Query; caller always handles the same shape
function useUser()       { return useQuery(...); }
function useServerTime() { return useQuery(...); }
```

**Tip:** use **Discriminated Unions** (`type Result = { ok: true } | { ok: false; reason: string }`) so the compiler enforces correct field access.

#### Rule 2.3 — Do not hide logic

A function must not silently do things not implied by its signature. `fetchBalance()` should fetch balance — not also fire analytics. Move the logging to the call site.

```ts
// ❌ fetchBalance secretly logs
async function fetchBalance() {
  const balance = await http.get<number>('...');
  logging.log('balance_fetched'); // hidden side-effect
  return balance;
}

// ✅ Caller composes the two
const balance = await fetchBalance();
logging.log('balance_fetched');
```

---

## 3. Cohesion

Code that must change together should sit together.

#### Rule 3.1 — Co-locate files that change together

Avoid type-first directory layouts (`/components`, `/hooks`, `/utils` at
the top level holding hundreds of files). Prefer domain-first layouts
so a feature is deletable as a single directory and cross-domain
imports are visible smells.

This repo's concrete layout: see `folder.md`.

#### Rule 3.2 — Replace magic numbers with named constants (cohesion view)

Same rule as 1.5, but the motivation is different: if `delay(300)` is tied to an animation that runs 300 ms, and someone changes the animation to 500 ms, they must **remember** to change the delay too. A shared `ANIMATION_DELAY_MS` constant forces them to change together.

#### Rule 3.3 — Choose field-level or form-level cohesion deliberately

The tradeoff is real, but pick one per form and apply it consistently.

- **Field-level** — each field owns validation. Good for async validation
  (email uniqueness) and highly reusable fields.
- **Form-level** — one schema validates the whole form. Good for
  interdependent fields (password confirm, wizards).

**In this repo:** form-level is the default (react-hook-form + Zod
schema). See `forms.md`. Use field-level only when `forms.md` explicitly
allows it (async validation).

---

## 4. Coupling

Minimize the blast radius of each change.

#### Rule 4.1 — Manage responsibilities individually

(Same shape as 1.3, but viewed through coupling.) A "god hook" like `usePageState()` ends up referenced by every component on a page; one edit to it can break the whole page. Split per responsibility so a change to `cardId` handling cannot touch `dateFrom` consumers.

#### Rule 4.2 — Allow duplicate code when divergence is likely

**Do not reflexively DRY.** Two pieces of code that look similar today may legitimately diverge tomorrow (different logging strings, different post-close behavior, different copy). Forcing them into one hook means every future divergence adds a parameter, and every change requires retesting every call site.

**Decision rule:**

- Similar logic, proven stable, identical behavior required → extract.
- Similar logic, likely to diverge per page/feature → **allow duplication.**

**Decision tree — extract vs duplicate:**

1. Same behavior, proven stable, must stay in sync --> **extract** a shared abstraction.
2. Similar behavior, likely to diverge per feature within 3 months --> **allow duplication**.
3. Looks similar but unrelated domain concerns --> **never merge**, even if the code is identical today.

#### Rule 4.3 — Eliminate props drilling via composition

If a prop passes through 2+ intermediate components that do not use it, that is coupling. Use the **Composition pattern** — let the parent render the leaf directly instead of threading props through a middle layer.

```tsx
// ❌ keyword, onConfirm, items drilled through ItemEditBody
<ItemEditModal ...>
  <ItemEditBody items={items} keyword={keyword} onConfirm={onConfirm} ... />
</ItemEditModal>

// ✅ Parent composes the leaf; middle layer gone
<Modal open={open} onClose={onClose}>
  <Input value={keyword} onChange={...} />
  <ItemEditList items={items} keyword={keyword} onConfirm={onConfirm} />
</Modal>
```

Alternatives to composition when deep state is genuinely needed: React Context, Zustand/Jotai/Redux, URL state. Do not reach for these _first_; try composition first.

---

## Agent Decision Checklist

Before emitting a code suggestion, the agent should silently answer:

1. **Readability** — Does a reader hold ≤ 6–7 contexts at once? Does it read top-to-bottom? Are conditions and numbers named?
2. **Predictability** — Can another dev guess behavior from name + signature alone? No hidden side effects? Consistent return shape with siblings?
3. **Cohesion** — Do the files/lines that must change together live together? Are magic constants extracted?
4. **Coupling** — If this changes in 3 months, how many unrelated files need edits? Is there props drilling? Is there premature deduplication?
5. **Trade-off named** — If a fix improves one principle at the cost of another, say so explicitly in the explanation.

## Quick "Code Smell" Triggers

When the agent sees these in existing code, flag them:

- `useEffect` + early-return-on-role branching in one component → Rule 1.1
- Raw inline auth/redirect checks inside page components → Rule 1.2
- Hook named `usePageState`, `useGlobalStore`, `useEverything` → Rules 1.3 / 4.1
- Boolean expression > 2 conjuncts/disjuncts without a name → Rule 1.4
- Any numeric literal that is not `0`, `1`, or obvious array indexing → Rules 1.5 / 3.2
- `a >= b && a <= c` (middle term repeated) → Rule 1.8
- Nested `? :` chains → Rule 1.7
- Same function name as an imported library symbol, with extra behavior → Rule 2.1
- Hook returning `.data` while sibling hooks return the full `Query` → Rule 2.2
- Function that fetches and also logs/tracks/mutates state → Rule 2.3
- Top-level `/components`, `/hooks`, `/utils` with hundreds of files → Rule 3.1
- A prop passing through a component that only forwards it → Rule 4.3
- A "shared" hook accepting 6+ boolean/config params → Rule 4.2 (undo the DRY)
- Hook managing 3+ unrelated URL params → Rules 1.3 / 4.1 (split by concern)
- Component with 2+ `useEffect` for unrelated side effects → Rule 1.1 (separate components)
- A function that fetches + logs + navigates in one body → Rule 2.3 (hidden logic)
- Hook returning 8+ values → SRP violation (split into focused hooks)
- `useCallback` wrapping a handler not passed to a `React.memo` child → unnecessary memoization (`components.md` §9)
- `useMemo` on a cheap derivation (string format, small-array map/filter) → unnecessary memoization (`components.md` §9)
- Preemptive `React.memo` without profiling evidence → unnecessary memoization (`components.md` §9)

---

## What This Document Deliberately Omits

- Formatting rules (indent, quotes, semicolons) — use Prettier/ESLint.
- Framework idioms (Next.js App Router vs Pages, Vue Options vs Composition) — orthogonal.
- Performance micro-optimizations (memoization heuristics, bundle splitting) — separate concern.
- Accessibility, i18n, security — also essential, but outside this scope.

These fundamentals are about **long-term modifiability**, not style.
