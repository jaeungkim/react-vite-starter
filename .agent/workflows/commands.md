---
description: Commands agents must run and verification protocol.
---

# Commands & Verification

## 1. Canonical commands

Run from the repo root. If a command is missing from `package.json`, stop and ask.

| Purpose          | Command              |
| ---------------- | -------------------- |
| Install          | `yarn install`       |
| Dev server       | `yarn dev`           |
| Build            | `yarn build`         |
| Type check       | `yarn type-check`    |
| Lint             | `yarn lint`          |
| Format (autofix) | `yarn format`        |
| Preview build    | `yarn preview`       |

"Full verify" for this starter is `yarn lint && yarn type-check`. If your fork adds a `check` script (or a test runner), update this table accordingly.

## 2. Verification protocol

- Run `yarn type-check` after changes to types, schemas, or shared utilities.
- Run `yarn lint` after any change.
- Run `yarn lint && yarn type-check` before declaring a task complete.
- If verification fails, fix the failures before responding "done".
- When reporting completion, state the commands run and their exit status.

## 3. Incremental verification

For multi-step tasks, verify after each logical step with the narrowest relevant command (e.g. `yarn type-check` after a type change; `yarn lint <path>` for one file). Do not batch ten edits and verify once.

## 4. Do not

- Run `yarn build` just to check types. Use `yarn type-check`.
- Skip verification by claiming "changes are trivial".
- Modify `yarn.lock` manually.
- Commit, push, or mark PRs as ready. Only the user does those.
