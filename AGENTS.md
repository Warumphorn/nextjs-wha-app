<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# nextGentWHA_1 — E-Commerce (Next.js 16 + Prisma v7 + Tailwind v4)

## Framework versions (all non-standard)

| Package | Version | Breaking changes from prior major versions |
|---|---|---|
| next | 16.2.7 | App Router only; `middleware.ts` → `proxy.ts`; all request APIs async (`params`, `searchParams`, `cookies()`, `headers()`); `next lint` removed (use `eslint` directly); Turbopack is default bundler; `cacheComponents: true` enables PPR/cache components |
| react | 19.2.7 | React canary (bundled with Next.js); View Transitions, Activity, `useEffectEvent` |
| prisma / @prisma/client | 7.x | Generator `prisma-client` (not `prisma-client-js`); output in `generated/prisma/`; driver adapter pattern (`@prisma/adapter-mariadb`); config via `prisma.config.ts` |
| tailwindcss | 4.x | CSS-first config (`@import "tailwindcss"` in CSS, no `tailwind.config.js`); `@tailwind` directives removed; PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`) |
| shadcn/ui | latest | Style `radix-luma`; icon library `remixicon`; components in `src/components/ui/` |
| better-auth | 1.6.11 | Email/password auth; Prisma adapter with MySQL provider |
| zod | 4.x | v4 API (different from v3) |
| react-hook-form | 7.76+ | Compatible with zod v4 via `@hookform/resolvers` |

## Commands (package.json scripts)

```bash
npm run dev      # Next.js dev server (Turbopack, no --turbopack flag needed)
npm run build    # Production build (run `npx prisma generate` first if schema changed)
npm run start    # Start production server
npm run lint     # ESLint via flat config (`eslint.config.mjs`), NOT `next lint`
```

No test, typecheck, or format scripts defined. Package manager is npm (`package-lock.json`).

## Architecture

- **App Router only** — app dir at `src/app/`; route groups: `(front)/` (public pages), `(auth)/` (login/signup), `api/` (data + auth endpoints). No root `layout.tsx` — each route group owns its layout.
- **Path alias**: `@/*` → `./src/*`
- **Prisma v7** — client import path from any `src/` file is `../../generated/prisma/client` (generated into repo, gitignored). Uses MariaDB driver adapter (`@prisma/adapter-mariadb`). Database: MySQL/MariaDB.
- **Auth** — better-auth at `src/lib/auth.ts` (server) + `src/lib/auth-client.ts` (client); API routes at `src/app/api/auth/[...all]/route.ts`; email/password only, no social providers
- **State** — Zustand with `persist` middleware (cart store at `src/lib/cart-store.ts`)
- **Styling** — Tailwind v4 CSS-first (`src/app/globals.css` via `@import "tailwindcss"`) + tw-animate-css + shadcn/ui radix-luma; dark mode via `.dark` class
- **Content** — Thai language (UI text, error messages, `<html lang="th">`)

## Prisma v7 notable differences

- Generator: `prisma-client` (not `prisma-client-js`); config: `prisma.config.ts` (not only `schema.prisma`)
- Client generated to `generated/prisma/` (gitignored, must regenerate after clone)
- Must run `npx prisma generate` after schema changes AND after `npm install`
- Uses driver adapter — see `src/lib/prisma.ts` for singleton pattern
- Prisma models use snake_case table/column naming (mapped from existing MySQL schema, e.g. `order_items`, `product_images`)
- Auth models (`User`, `Session`, `Account`, `Verification`) follow better-auth conventions with `@@map()` remapping

## ESLint

- Flat config at `eslint.config.mjs` (not `eslintrc.*` or `eslint.config.js`)
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`

## Key constraints

- Requires MariaDB/MySQL running locally (see `.env` for connection string)
- No CI/CD, no test suite, no pre-commit hooks
- Docker deployment: multi-stage Dockerfile (node:24-alpine); copies `generated/prisma/` into runner stage
- No `.github/` workflows

## ข้อกำหนดหลัก
- แยก Typescript Type ทุกอย่าง ออกไปไว้ที่โฟลเดอร์ src/types
-การตั้งชื่อไฟล์ TypeScript (.ts) ให้ตั้งตามตัวอย่างนี้ คือ course-service.ts
-ห้ามใข้คำสั่ง npx prisama db push
