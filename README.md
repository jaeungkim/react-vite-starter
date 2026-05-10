# react-vite-starter

Personal React 19 + Vite starter with the stack I reach for on every project.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **shadcn/ui** (Radix Nova preset, Lucide icons, Geist font)
- **React Router v6** (`react-router-dom`)
- **TanStack Query 5** (with devtools in dev)
- **Axios** for HTTP
- **React Hook Form** + **Zod** (via `zodResolver`)
- **Zustand** (with `devtools` middleware)
- **sonner** for toasts
- **ESLint 10** (flat config) + **Prettier** (with `prettier-plugin-tailwindcss`)
- **Yarn 4** (`nodeLinker: node-modules`)

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check (`tsc -b`) and build for production |
| `yarn preview` | Preview the production build |
| `yarn lint` | Run ESLint |
| `yarn format` | Run Prettier + ESLint --fix on `src/` |
| `yarn type-check` | `tsc --noEmit` against `tsconfig.app.json` |

## Environment variables

All client env vars must be prefixed `VITE_`. Place them in `.env.local` (gitignored).

```
VITE_API_BASE_URL=https://api.example.com
```

## Folder layout

```
src/
├── apis/             # axios client + per-domain query/mutation factories
│   ├── client.ts
│   └── example/      # example domain folder, mirror this shape
├── components/
│   ├── RootLayout.tsx
│   └── ui/           # shadcn-generated components live here
├── pages/
│   ├── HomePage/     # each page owns its own components, hooks, schemas
│   └── NotFoundPage.tsx
├── routes/Router.tsx # createBrowserRouter + createRoutesFromElements
├── stores/           # Zustand stores
├── hooks/            # cross-cutting hooks only
├── lib/utils.ts      # cn() helper
├── types/, utils/, assets/
├── index.css         # @import "tailwindcss" + theme tokens
└── main.tsx          # createRoot + QueryClientProvider + Router
```

Page-owned hooks/schemas live under `pages/<PageName>/{hooks,schemas,components}/` —
keep cross-cutting hooks in `src/hooks/`.

## Adding shadcn components

The starter pre-installs a common kit: `button`, `input`, `label`, `form`,
`card`, `dialog`. Pull anything else on demand:

```
npx shadcn@latest add <name>
```

Components land in `src/components/ui/`. The path alias `@/*` resolves to `src/*`
via `tsconfig.json` + `tsconfig.app.json` and `vite-tsconfig-paths`.

## Conventions

- **Query factories** export an object like `xxxQueries.{all, lists, list}`
  returning `queryOptions(...)`. See `src/apis/example/example.queries.ts`.
- **Forms** use `useForm({ resolver: zodResolver(schema) })` with the schema
  next to the page (`pages/<Page>/schemas/`).
- **Zustand stores** are wrapped in `devtools(..., { name: 'store-name' })`
  so they show up in Redux DevTools.
- **Path alias** `@/*` is the only resolution path. Don't add `baseUrl: src` —
  one path, one truth.
