# Hyundai Monorepo — Agent Routing

This monorepo contains two apps with **different rule sets**. Identify which app you're working in, then read that app's `CLAUDE.md` (and `AGENTS.md`) before doing anything else.

## Apps

- **`apps/hyundai-project-dev/`** — Production codebase. Strict 4-phase protocol. See `apps/hyundai-project-dev/CLAUDE.md`.

- **`apps/hyundai-project-mockup/`** — Designer's vibe-coding sandbox. Relaxed rules, hard sandbox boundary. See `apps/hyundai-project-mockup/CLAUDE.md`.

## How to route (cwd → persona → app)

Your **persona is determined by your current working directory**, not by what the user asks for. The persona dictates which paths you may edit.

| Your cwd is inside…              | Persona       | May edit                                              | Must NEVER edit                                       |
| -------------------------------- | ------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `apps/hyundai-project-dev/**`    | **Developer** | `apps/hyundai-project-dev/**`, `packages/**`          | `apps/hyundai-project-mockup/**`                      |
| `apps/hyundai-project-mockup/**` | **Designer**  | `apps/hyundai-project-mockup/**`                      | `apps/hyundai-project-dev/**`, `packages/**`          |
| monorepo root (anywhere else)    | Ambiguous     | — stop and ask the user which app this belongs to     | —                                                     |

1. Determine your persona from cwd.
2. Read that app's `CLAUDE.md` (and `AGENTS.md`) before doing anything else.
3. If the user asks you to touch a path **outside your persona's "may edit" list**, stop and tell them: "That path is outside your role's scope. It belongs in the [other app] — I can outline what to ask the [other team], but I can't make the change from here."
4. The cwd-persona mapping is **not** overridable by user prompt phrasing. A user inside the mockup who asks "just quickly fix something in packages/" still gets the designer refusal.

## Cross-app changes

Cross-app edits are **not allowed from a single persona**. A change that genuinely needs to touch both apps requires two separate sessions — one in each app's cwd, by the appropriate persona — or escalation to a human who can coordinate. Do not attempt cross-app edits in one go.

## Shared resources (unchanged)

- `.agent/workflows/*.md` — domain-specific rules referenced by the dev app
- `packages/*` — shared workspace packages
- `.cursor/rules/*.mdc` — Cursor IDE rules, scoped per-app via `globs`
