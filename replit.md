# ViaSafe

Plataforma de segurança viária para Franca (SP) com app mobile para cidadãos e painel web para operadores municipais.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port from $PORT, proxied at /api)
- `pnpm --filter @workspace/mobile run dev` — Expo mobile app
- `pnpm --filter @workspace/dashboard run dev` — React web dashboard (proxied at /dashboard/)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate hooks + Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `SESSION_SECRET`
- Default admin login: `admin@viasafe.com.br` / `password123`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Mobile**: Expo + React Native (tabs: Dashboard, Routes, Report, Learn)
- **API**: Express 5 + Drizzle ORM + PostgreSQL
- **Dashboard**: React + Vite + Tailwind + Recharts + wouter + @tanstack/react-query
- Auth: JWT via jsonwebtoken + bcryptjs (Bearer token, stored in localStorage)
- Validation: Zod (`zod/v4`), `drizzle-zod`, Orval codegen
- Build: esbuild (CJS bundle for API)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-zod/src/generated/api.ts` — Zod schemas (generated, do not edit)
- `lib/api-client-react/src/generated/api.ts` — React Query hooks (generated)
- `lib/db/src/schema/` — Drizzle schema: users, reports, alerts
- `artifacts/api-server/src/routes/` — Express routes: auth, reports, alerts, stats, health
- `artifacts/dashboard/src/pages/` — dashboard, login, reports, alerts
- `artifacts/mobile/app/(tabs)/` — mobile tab screens

## Architecture decisions

- Contract-first API: OpenAPI → Orval codegen → typed hooks + Zod validators used in both server routes and dashboard client
- JWT auth stored in localStorage; `setAuthTokenGetter(() => getToken())` in `main.tsx` injects Bearer header on every API call via custom-fetch
- Dashboard constrained to 430px max-width with mobile-style bottom nav — mirrors the mobile app UX
- Platform-specific map files: `TrafficMap.native.tsx` + `TrafficMap.web.tsx` to avoid bundling react-native-maps on web
- `SESSION_SECRET` env var doubles as JWT signing secret

## Product

- **Mobile app**: Citizens report traffic incidents (accidents, potholes, flooded roads, etc.), view route safety, learn traffic rules with gamified quizzes
- **Web dashboard**: Municipal operators view summary stats + charts, manage community reports (filter/update status), manage traffic alerts (create/toggle/severity)
- **API**: Auth (register/login/me), reports CRUD, alerts CRUD, stats aggregates (timeline, by-type, by-status)

## User preferences

- Dashboard must be in mobile format (max 430px, bottom tab bar, no desktop sidebar)
- App name: ViaSafe (not "Franca Segura")

## Gotchas

- After changing `openapi.yaml`, always run codegen before touching route or client code
- `lib/api-zod/src/index.ts` must export only `./generated/api` — do NOT restore the `./generated/types` export (causes TS2308 duplicate export errors)
- `orval.config.ts` must NOT have the `schemas` option in the zod output block
- Express 5: wildcard routes need `/{*splat}`, optional params use `{/:id}` syntax
- `req.params.id` is `string | string[]` — always normalize before parseInt

## Pointers

- See `.local/skills/pnpm-workspace` for workspace conventions
- See `.local/skills/pnpm-workspace/references/server.md` for Express 5 route patterns
