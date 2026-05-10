# AGENTS.md

Canonical instructions for any coding agent working in this repo (Claude Code, Cursor, Codex, Aider, …). Tool-agnostic. Read this first.

## Stack

React + Vite SPA. TypeScript, Yarn, Tailwind CSS v4, React Router v7 (declarative mode), TanStack Query, react-hook-form, Zod, Zustand, shadcn/ui.

## How to work in this repo

1. **Read the baseline rules** before any task:
   - `.agent/workflows/frontend-fundamentals.md` — 4 principles (readability, predictability, cohesion, coupling) and SOLID mapping for React.
   - `.agent/workflows/behavior.md` — how to think, plan, and change code.
   - `.agent/workflows/commands.md` — verification commands.

2. **Read the domain rules** that match the task. More than one row can apply — read every match.

   | Task involves… | Read |
   | --- | --- |
   | API calls, TanStack Query, axios, data fetching | `.agent/workflows/api.md` |
   | Forms, react-hook-form, Zod, validation | `.agent/workflows/forms.md` |
   | Any React component (`.tsx`) | `.agent/workflows/components.md` AND `.agent/workflows/shadcn.md` |
   | Files in `src/components/ui/**` | `.agent/workflows/shadcn.md` AND `.agent/workflows/components.md` |
   | Custom hooks (`use*.ts`) | `.agent/workflows/hooks.md` |
   | State management (Zustand, Context) | `.agent/workflows/state.md` |
   | New files or directories | `.agent/workflows/folder.md` |
   | TypeScript types or interfaces | `.agent/workflows/typescript.md` |
   | Routes, navigation, react-router | `.agent/workflows/react-router.md` |
   | Loading, skeleton, error, empty states | `.agent/workflows/loading-states.md` |
   | React hooks or component lifecycle patterns | `.agent/workflows/react.md` |
   | Tailwind classes, design tokens, dark mode | `.agent/workflows/tailwind.md` |
   | Anything not listed above | `.agent/workflows/behavior.md` + `.agent/workflows/frontend-fundamentals.md` |

3. **Implement.** Follow every rule from the files you read. When two files conflict, the domain file wins over `frontend-fundamentals.md`. When uncertain, stop and ask — never guess.

4. **Verify.** Run `yarn check`. Fix every error. Report the command and its exit status. Do not say "done" unless `yarn check` exits 0.

## How these files fit together

- `frontend-fundamentals.md` is the decision framework when no mechanical rule applies.
- The domain files (api, forms, components, hooks, …) are authoritative for their domain. When they conflict with `frontend-fundamentals.md`, the domain file wins.
- Don't duplicate rules across files. When a file cross-references another, follow the link.

## Non-negotiable

1. Run `yarn check` before declaring a task complete.
2. Never commit. Never push. Never mark PRs ready unless explicitly asked.
3. When unsure, stop and ask — see `behavior.md` §1.
