---
description: API layer conventions — file structure, query key factories, mutations, and typing rules.
---

# API Layer Convention (`apis/`)

Group API-related code by resource domain under `apis/`.

## 1. Structure per domain

```text
apis/{domain}/
  {domain}Api.ts              # Standalone exported async functions (axios calls)
  {domain}.queries.ts         # React Query option factories (queryOptions)
  {domain}.mutations.ts       # Mutation hooks (useMutation) -- only if needed
  {domain}.types.ts           # API-specific types (request/response/params) -- only if needed
  index.ts                    # Barrel re-export
```

## 2. Rules

- **Shared infrastructure** (`client.ts`, `config.ts`, cross-domain utilities like `fileControllerApi.ts`) stays at the `apis/` root.
- **Always use absolute imports** (e.g. `apis/attribute/attributeApi`). Never use relative imports (`./`) — even within the same domain folder.
- **Barrel (`index.ts`)** re-exports query factories, mutation hooks, and types. Page code imports from the barrel: `import { projectQueries } from 'apis/project'` or `import type { Project } from 'apis/project'`.
- **API files** contain only HTTP logic (no React, no hooks). Query/mutation files contain only React Query wrappers.
- **API files use standalone exported async functions**, not a single object with methods. Each function destructures `{ data }` from the axios response and returns it directly. See section 5 for the template.
- **Create `*.mutations.ts` only when the domain has mutations.** Query-only domains skip this file.
- **Create `*.types.ts` only for API-specific shapes** (request bodies, response envelopes, query params). Domain-agnostic types shared across multiple page domains belong in `src/types/` instead.
- **All queries and mutations live in `apis/`**. Never scatter API hooks in page-local folders (`pages/*/api/`, `pages/*/hooks/api/`, `pages/dashboard/api/`, etc.). If a page needs a new query or mutation for an API resource, add it to the corresponding `apis/{domain}/` folder.

## 3. Query Key Factory Pattern

Never use hardcoded string arrays for query keys. Use a self-referencing factory object so keys are a single source of truth.

### Template

```ts
export const {domain}Queries = {
  all: () => ['{domain}'] as const,

  lists: () => [...{domain}Queries.all(), 'list'] as const,

  list: (params?: GetListParams) =>
    queryOptions({
      queryKey: [...{domain}Queries.lists(), params],
      queryFn: () => get{Domain}s(params),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: [...{domain}Queries.all(), 'detail', id],
      queryFn: () => get{Domain}ById(id),
      enabled: !!id,
    }),
};
```

### Key hierarchy rules

- `all()` returns a tuple `['{domain}'] as const` — the broadest scope.
- `lists()` extends `all()` — invalidate this to refresh all list variations without touching details.
- Concrete queries (`list`, `detail`, `filters`) extend the hierarchy and add their specific params.
- Mutations invalidate the **narrowest scope** that covers what changed. Default to `all()` if unsure; narrow to `lists()` when only list data is affected.

### Invalidation in mutations

```ts
export function useCreate{Domain}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRequest) => create{Domain}(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: {domain}Queries.all() }),
  });
}
```

## 4. Types file (`{domain}.types.ts`)

Keep API-specific types co-located:

- **Entity types** — the shape returned by the API (e.g. `KpiItem`)
- **Request types** — `Create{Domain}Request`, `Update{Domain}Request`
- **Param types** — `Get{Domain}ListParams`, `Get{Domain}FiltersParams`
- **Response wrappers** — only if the wrapper adds domain-specific fields beyond `BaseResponse<T>`

Shared response envelopes (`BaseResponse`, `PaginatedResponse`) live in `apis/types.ts`.

## 5. API file template (`{domain}Api.ts`)

Use standalone exported async functions. Each function destructures `{ data }` from the axios response.

```ts
import { client } from 'apis/client';
import type { {Entity}, Create{Entity}Request, Update{Entity}Request, Get{Entity}sParams } from 'apis/{domain}/{domain}.types';
import type { PaginatedResponse, BaseResponse } from 'apis/types';

const BASE = '/path/to/{domain}';

export const get{Entity}s = async (params?: Get{Entity}sParams) => {
  const { data } = await client.get<PaginatedResponse<{Entity}>>(BASE, { params });
  return data;
};

export const get{Entity}ById = async (id: string) => {
  const { data } = await client.get<BaseResponse<{Entity}>>(`${BASE}/${id}`);
  return data;
};

export const create{Entity} = async (body: Create{Entity}Request) => {
  const { data } = await client.post<BaseResponse<{Entity}>>(BASE, body);
  return data;
};

export const update{Entity} = async (id: string, body: Update{Entity}Request) => {
  const { data } = await client.put<BaseResponse<{Entity}>>(`${BASE}/${id}`, body);
  return data;
};

export const delete{Entity} = async (id: string) => {
  const { data } = await client.delete(`${BASE}/${id}`);
  return data;
};
```

**Do not** use a single exported object with methods (e.g. `export const {domain}Api = { getList: ... }`). Standalone functions are easier to tree-shake and read more naturally at call sites.
