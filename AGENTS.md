# AGENTS.md

Canonical instructions for any coding agent working in this repo (Claude Code, Cursor, Codex, Aider, …). Tool-agnostic. Read this first.

## Stack

React + Vite SPA. TypeScript, Yarn, Tailwind CSS v4, React Router v7 (declarative mode), TanStack Query, react-hook-form, Zod, Zustand, shadcn/ui.

## How to work in this repo

1. **Read the baseline rules** before any task:
   - `.agent/workflows/behavior.md` — how to think, plan, and change code.
   - `.agent/workflows/commands.md` — verification commands.

2. **Read the domain rules** that match the task. More than one row can apply — read every match.

   | Task involves… | Read |
   | --- | --- |
   | API calls, TanStack Query, axios, data fetching | `.agent/workflows/api.md` |
   | Forms, react-hook-form, Zod, validation | `.agent/workflows/forms.md` |
   | Any React component (`.tsx`) | `.agent/workflows/components.md` AND `.agent/workflows/shadcn.md` |
   | Files in `src/components/ui/**` | `.agent/workflows/shadcn.md` AND `.agent/workflows/components.md` |
   | State management (Zustand, Context, server state) | `.agent/workflows/state.md` |
   | New files or directories | `.agent/workflows/folder.md` |
   | Anything not listed above | `.agent/workflows/behavior.md` |

3. **Implement.** Follow every rule from the files you read. When two files conflict, the more specific one wins. When uncertain, stop and ask — never guess.

4. **Verify.** Run `yarn lint && yarn type-check`. Fix every error. Report the commands and their exit status. Don't say "done" unless both pass.

## Library docs

When you need an API detail you're not 100% sure of — React 19, Tailwind v4, TanStack Query, react-hook-form, Zod, react-router-dom, shadcn/ui, etc. — look it up before writing code:

- **Context7 MCP** is the preferred lookup path. Call `resolve-library-id` for the package, then `query-docs`.
- If Context7 doesn't cover the package, fall back to the official site (`react.dev`, `tailwindcss.com`, `tanstack.com/query`, `react-hook-form.com`, `zod.dev`, `ui.shadcn.com`, …).

Don't guess from training-data memory; v4-style fast-moving packages drift fast enough that the agent's memory is often wrong.

## How these files fit together

- The domain files (api, forms, components, shadcn, state, folder) are authoritative for their domain.
- `behavior.md` is the fallback when no domain rule applies.
- Don't duplicate rules across files. When a file cross-references another, follow the link.

## Non-negotiable

1. Run `yarn lint && yarn type-check` before declaring a task complete.
2. Never commit. Never push. Never mark PRs ready unless explicitly asked.
3. When unsure, stop and ask — see `behavior.md` §1.
