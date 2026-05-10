# CLAUDE.md

This project's AI guidelines live in `AGENTS.md` (cross-tool standard). Claude Code reads `CLAUDE.md` first, so we import them here:

@AGENTS.md

## Claude Code specifics

- Workflow rules in `.agent/workflows/*.md` are loaded on demand based on the task table in `AGENTS.md` — read them as the task requires, not all upfront.
- More specific rules win over general ones.
- Don't commit, push, or mark PRs ready unless explicitly asked.
