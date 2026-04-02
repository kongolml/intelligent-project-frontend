# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint via `eslint src --ext .ts,.tsx` |
| `npm run analyze` | Production build with bundle analyzer |
| `npm run analyze:dev` | Dev server with bundle analyzer |

## Environment

Requires `API_URL` env var (PayloadCMS backend URL). Copy `.env.example` to `.env.local`.

## Architecture

**Next.js 16 (App Router) + React 19.** Portfolio/showcase website with scroll-triggered animations.

### Server/Client Split
- **Server components** fetch data via `src/app/lib/api.ts` → PayloadCMS REST API
- **Client components** (marked `"use client"`) handle animations and interactivity
- **Naming:** `Foo.tsx` (server) + `FooClient.tsx` (client)

### Routing
- `/` — Homepage
- `/projects` — Portfolio list with category filtering
- `/projects/[slug]` — Project detail page
- `/about-us` — Team page

### Animation Stack
1. **GSAP 3 + ScrollMagic** — homepage horizontal carousel (`useScrollEffects.ts`)
2. **CSS + IntersectionObserver** — project detail reveals (`.reveal`/`.reveal-line` → `.visible`)

## Path Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@types/*` | `src/types/*` |
| `@components/*` | `src/app/components/*` |
| `@pages/*` | `src/app/pages/*` |
| `@assets/*` | `src/assets/*` |

## Code Style

### Imports Order
1. `"use client"` directive (first if present)
2. React imports
3. Third-party libs (gsap, next/image, next/link)
4. Type imports
5. Local lib/service imports (`@/app/lib/api`)
6. Component imports
7. SCSS module (`styles from "./Foo.module.scss"`)
8. Asset imports (`@assets/...`)

### Naming Conventions
- **Files:** PascalCase components, camelCase hooks/libs
- **Components:** `export default function ComponentName(...)` (no React.FC)
- **Props:** `ComponentNameProps` interface
- **Constants:** UPPER_SNAKE_CASE

### TypeScript
- `strict: true` enabled — do not weaken
- Use `interface` for objects, `type` for unions/intersections
- Avoid `any` — only for third-party interop with explanatory comment
- PayloadCMS null → frontend `?` via mapper layer

### SCSS Modules
- One `.module.scss` per component directory
- camelCase classes
- Mobile breakpoint: `variables.$bp-mobile` (768px)
- Section comments: `/* HERO SECTION */`

### Error Handling
- **API:** `.catch()` returns safe fallback (empty array/null), never throws
- **Server components:** try/catch with empty fallback
- **Not-found:** `notFound()` for missing resources
- **DOM guards:** `if (!ref.current) return;`

### React Patterns
- `useRef<HTMLDivElement>(null)` with specific HTML types
- `useMemo`/`useCallback` for computed/stale handlers
- `dangerouslySetInnerHTML` with `sanitizeHtml()` (client-only)
- SVGs: `import Logo from "@assets/logo.svg"` via `@svgr/webpack`

## Types

Shared types in `src/types/`. Import via `@types/*`:
- `PayloadPortfolioItem` — raw API shape
- `PortfolioItem` — transformed frontend type (use `descriptionHTML` over EditorJS blocks)

## Legacy Files — DO NOT MODIFY

- `src/app/projects/[slug]/page.old.tsx`
- `src/app/projects/[slug]/ProjectDetailClient.tsx`

Use `ProjectDetailClientV2.tsx` instead.

## Security

### Headers (next.config.ts)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Rate Limiting
Webhook endpoints protected: 30 req/min per IP (HTTP 429 when exceeded)

### sanitizeHtml Guard
`src/app/lib/sanitize.ts` is client-only. Throws if called server-side.

## Performance

Bundle analysis: `npm run analyze` or `npm run analyze:dev`

## Deployment

GitHub Actions on push to `main`: builds with `API_URL` secret, rsyncs to DigitalOcean Droplet, PM2 on port 3001. `output: 'standalone'` in next.config.ts.
