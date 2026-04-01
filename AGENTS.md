# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint via `next lint` |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once (CI) |

**Testing:** Vitest with React Testing Library configured. Tests located in `src/**/*.test.{ts,tsx}`.

## Environment

Requires `API_URL` env var (PayloadCMS backend URL). Copy `.env.example` to `.env.local`. The helper `src/app/lib/api.ts` (`getApiUrl()`) throws immediately if unset.

## Architecture

**Next.js 15 (App Router) + React 19.** Portfolio/showcase website with heavy scroll-triggered animations.

### Server/Client Component Split

- **Server components** (default) handle async data fetching via service functions in `src/app/lib/api.ts`.
- **Client components** (marked `"use client"`) handle DOM manipulation, animations, and interactivity.
- **Naming convention:** `Foo.tsx` (server) + `FooClient.tsx` (client). Example: `HomepageV2.tsx` fetches data, `HomepageV2Client.tsx` renders with animations.

### Data Flow

Server components call functions from `src/app/lib/api.ts` → fetch from PayloadCMS REST API at `${API_URL}/api/{collection-slug}` → mapper functions transform raw types to frontend types → data passed as props to client components.

Collections: `portfolio-items`, `portfolio-categories`, `teammates`.

### Routing

- `/` — Homepage (horizontal-scroll portfolio showcase)
- `/projects` — Portfolio list with category filtering
- `/projects/[slug]` — Project detail page
- `/about-us` — Team page

### Animation Stack

1. **GSAP 3 + ScrollMagic** — homepage horizontal carousel (`src/app/hooks/useScrollEffects.ts`). Register GSAP plugins before use.
2. **CSS + IntersectionObserver** — project detail page (`.reveal`/`.reveal-line` classes get `.visible` on viewport entry).

### Types

Shared types in `src/types/`. Import via `@types/*` alias.

- `Payload*` types (e.g., `PayloadPortfolioItem`) — raw API response shapes
- Clean frontend types (e.g., `PortfolioItem`) — transformed, component-ready shapes
- `PortfolioItem.descriptionHTML` (pre-rendered HTML) preferred over `description` (EditorJS blocks)

### Legacy Files — DO NOT MODIFY

- `src/app/projects/[slug]/page.old.tsx`
- `src/app/projects/[slug]/ProjectDetailClient.tsx`

Active replacement: `ProjectDetailClientV2.tsx`.

## Path Aliases (tsconfig)

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@types/*` | `src/types/*` |
| `@components/*` | `src/app/components/*` |
| `@pages/*` | `src/app/pages/*` |
| `@assets/*` | `src/assets/*` |

## Code Style

### Imports

Loosely grouped with optional section comments. Typical order:

1. `"use client"` directive (always first, when present)
2. React imports
3. Third-party libraries (gsap, next/image, next/link)
4. Type imports
5. Local lib/service imports (`@/app/lib/api`)
6. Component imports
7. SCSS module (`styles from "./Foo.module.scss"`)
8. Asset imports (`@assets/...`)

Use `@/` path alias for cross-directory imports. Relative paths (`../../../`) are also used but prefer the alias.

### Naming Conventions

- **Files:** PascalCase for components (`HomepageV2.tsx`), camelCase for hooks (`useScrollEffects.ts`) and libs (`api.ts`).
- **Components:** `export default function ComponentName(...)`. No `React.FC`.
- **Props interfaces:** `ComponentNameProps` (e.g., `PortfolioListProps`).
- **Variables/functions:** camelCase.
- **Constants:** UPPER_SNAKE_CASE (`STIFFNESS`, `DAMPING`, `NAV_ITEMS`).
- **Enums:** PascalCase with UPPER_SNAKE_CASE members (`PortfolioCategorySlugs.IDENTITY`).

### TypeScript

- `strict: true` is enabled — do not weaken it.
- Use `interface` for object shapes (props, API responses). Use `type` for unions and intersections.
- Avoid `any` — only use for unavoidable third-party interop (e.g., ScrollMagic). Add type assertions with a comment explaining why.
- Use generics for type-safe API helpers: `fetchFromPayload<T>(path)`.
- Nullable PayloadCMS fields use `| null`; frontend types use `?` (undefined). The mapper layer converts.

### SCSS Modules

- One `.module.scss` per component directory.
- camelCase class names (`.heroContent`, `.selectedWorkHeader`).
- Import global tokens: `@use "../../global.variables.scss" as variables;` then `variables.$bp-mobile`.
- Mobile breakpoint: `768px` (use `variables.$bp-mobile`).
- Use `:global(.className)` for cross-boundary animation utility classes.
- Section-comment banners for organization: `/* HERO SECTION */`.

### Error Handling

- **API layer:** `.catch()` on fetch promises, log error, return safe fallback (empty array or `null`). Never throw to callers.
- **Server components:** `try/catch` with empty fallback for data fetching.
- **Not-found:** Use Next.js `notFound()` for missing resources (e.g., invalid slug).
- **Context guards:** `if (!ctx) throw new Error("useX must be used within XProvider")`.
- **DOM null guards:** Always check `if (!ref.current) return;` before DOM manipulation.

### React Patterns

- Use `useRef<HTMLDivElement>(null)` with specific HTML types.
- Use `useMemo` for computed/filtered data, `useCallback` for stable handler references.
- `forwardRef` for components that need ref forwarding.
- `dangerouslySetInnerHTML` is used for CMS HTML — always sanitize via `src/app/lib/sanitize.ts` (`sanitizeHtml()`).
- SVGs imported as React components: `import Logo from "@assets/logo.svg";` (via `@svgr/webpack`).
- CSS custom properties for stagger animations: `style={{ "--stagger": `${i * 80}ms` } as React.CSSProperties}`.

## Security & Performance

### Security Headers

next.config.ts (lines 26-48) configures security headers applied to all routes:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevents clickjacking by disallowing iframe embedding |
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information sent with requests |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Restricts access to browser features |

### Rate Limiting

Webhook endpoints are protected by rate limiting in `src/app/lib/rate-limit.ts`:

- **Limit:** 30 requests per minute per IP address
- **Implementation:** In-memory Map with sliding window reset
- **Response:** HTTP 429 with `{ "error": "Rate limit exceeded. Try again later." }` when exceeded
- **Detection:** Uses `x-forwarded-for` or `x-real-ip` headers to identify clients

### Bundle Analysis

Analyze bundle size during development or production builds:

| Command | Purpose |
|---------|---------|
| `npm run analyze` | Production build with interactive bundle analyzer |
| `npm run analyze:dev` | Dev server with bundle analyzer |

Uses `@next/bundle-analyzer` configured in next.config.ts. Set `ANALYZE=true` environment variable to enable.

### Lighthouse CI

Automated performance testing runs on every pull request to `main` via `.github/workflows/lighthouse.yml`. Configuration in `lighthouserc.json`:

**Thresholds (warn/error):**
- Performance: 0.8 (minScore)
- Accessibility: 0.9 (minScore, error)
- Best Practices: 0.85 (minScore)
- SEO: 0.9 (minScore)

**Core Web Vitals (warn):**
- First Contentful Paint: max 2000ms
- Largest Contentful Paint: max 4000ms
- Cumulative Layout Shift: max 0.1
- Total Blocking Time: max 500ms

**Pages tested:** `/`, `/projects`, `/about-us` (3 runs each)

### sanitizeHtml Guard

The `sanitizeHtml()` function in `src/app/lib/sanitize.ts` is client-only. It throws `Error('sanitizeHtml is client-only')` if called in a server context. Always use this function only in client components after any server-side rendering is complete.

## Deployment

GitHub Actions on push to `main`: builds with `API_URL` secret, rsyncs standalone build to DigitalOcean Droplet, restarts PM2 on port 3001. Config: `output: 'standalone'` in `next.config.ts`.
