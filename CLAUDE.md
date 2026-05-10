# CLAUDE.md

This project's AI guidelines live in `AGENTS.md` (cross-tool standard). Claude Code reads `CLAUDE.md` first, so we import them here:

@AGENTS.md

## Claude Code specifics

- Workflow rules in `.agent/workflows/*.md` are loaded on demand based on the task table in `AGENTS.md` — read them as the task requires, not all upfront.
- Domain rules override `frontend-fundamentals.md` when they conflict.
- Don't commit, push, or mark PRs ready unless explicitly asked.

### MCP servers worth reaching for

- **Context7** — `resolve-library-id` then `query-docs` for current docs of any library in this stack (React 19, Tailwind v4, TanStack Query, react-hook-form, Zod, react-router-dom, shadcn/ui, …). Prefer this over relying on training-data memory; fall back to web search only when Context7 doesn't cover the package.
- **Figma** — when the user shares a Figma URL, use `get_design_context` (or the `/figma-implement-design` skill) instead of eyeballing screenshots.
- **GitHub** — use the `gh` CLI for issues, PRs, and reviews.

### Skills

Skills are user-triggered (`/skill-name`). Don't auto-invoke them. Mention the relevant one when it applies — e.g. "looks like a job for `/figma-implement-design`" — and let the user fire it.
