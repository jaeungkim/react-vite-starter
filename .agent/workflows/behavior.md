---
description: Behavioral guidelines to reduce common LLM coding mistakes.
---

# Behavior

## 1. Think before coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity first

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Cognitive load ceiling

A reader's working memory holds ~6 concepts at a time. If a function,
component, or hook requires holding more than 6 simultaneously, break it
down. Abstractions should *reduce* cognitive load — not add indirection
for its own sake. If your refactor forces the reader to jump between
more files or hold more context than before, undo it.

### Inlining logic vs UI

- **Hooks / utils**: for 1–5-line wrappers used in exactly one place, inline at the call site.
- **UI components**: NEVER inline structural React components (headers, banners, grids) just because they're single-use. Keep parents declarative by using smaller sub-components.

## 3. Surgical changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

Test: every changed line should trace directly to the user's request.

## 4. Goal-driven execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Declarative component handlers (WHAT over HOW)

Components are declarative, focused on WHAT happens, not HOW. Abstract imperative boilerplate into custom hooks or utility functions.

## 6. When to allow duplication

Do not reflexively DRY. Two similar-looking hooks or components in
different domains are allowed — even encouraged — if they are likely to
diverge. Premature extraction couples unrelated features and turns every
future change into a multi-site regression test.

Before extracting a shared abstraction, ask:

1. Is the behavior **proven identical** across all call sites today?
2. Will it **remain identical** — or will I need feature-specific
   parameters within 3 months?
3. If it diverges, can I split it back without breaking callers?

If the answer to #2 is "probably not," keep the duplication.

Cross-ref: `frontend-fundamentals.md` Rule 4.2 and the decision tree
under §4.
