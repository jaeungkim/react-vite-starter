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
| Lint (prettier)  | `yarn lint:prettier` |
| Format (autofix) | `yarn format`        |
| Full verify      | `yarn check`         |
| Storybook        | `yarn storybook`     |

`yarn check` runs `lint`, `lint:prettier`, and `type-check` in sequence.

There is currently no test runner configured. If tests are added, document the command here.

## 2. Verification protocol

- Run `yarn type-check` after changes to types, schemas, or shared utilities.
- Run `yarn lint` after any change.
- Run `yarn check` before declaring a task complete.
- If verification fails, fix the failures before responding "done".
- When reporting completion, state the command run and its exit status.

## 3. Incremental verification

For multi-step tasks, verify after each logical step with the narrowest relevant command (e.g. `yarn type-check` after a type change; `yarn lint <path>` for one file). Do not batch ten edits and verify once.

## 4. Do not

- Run `yarn build` just to check types. Use `yarn type-check`.
- Skip verification by claiming "changes are trivial".
- Modify `yarn.lock` manually.
- Commit, push, or mark PRs as ready. Only the user does those.
