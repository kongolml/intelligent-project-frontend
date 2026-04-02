# AGENTS.md

Guidance for AI coding agents working in this repository.

---

## 1) Commands (build/lint/test)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (TypeScript/TSX) |
| `npm run analyze` | Production build + bundle analyzer |
| `npm run analyze:dev` | Dev server + bundle analyzer |

### Running a single test

There is currently **no configured test runner script** in `package.json`.

If/when tests are added, prefer a single-test command like:
- `npm test -- -t <name>` (Jest)
- `vitest run -t <name>` or `vitest -t <name>` (Vitest)

Until then:
- Run `npm run lint` and `npm run build`.
- Do targeted manual checks of affected pages.

---

## 2) Environment

Required env var:
- `API_URL` — PayloadCMS REST API URL.

Copy `.env.example` → `.env.local` for local development.

---

## 3) Architecture

**Next.js 16 (App Router) + React 19 + TypeScript (strict).**

### Server/Client Split

- **Server components** fetch data via `src/app/lib/api.ts` → PayloadCMS REST API
- **Client components** are marked with a top `"use client"` directive
- **Naming:** `Foo.tsx` (server) + `FooClient.tsx` (client)

### Routing

- `/` — Homepage with horizontal scroll carousel
- `/projects` — Portfolio list with category filtering
- `/projects/[slug]` — Project detail page
- `/about-us` — Team page

### Data Fetching

- API functions in `@/app/lib/api.ts` with Next.js `fetch` + `revalidateTag`
- Cache tags: `portfolio-items`, `portfolio-categories`, `teammates`
- Webhook at `/api/webhook` triggers on-demand revalidation
- Safe fallbacks: `.catch()` returns `[]` or `null`, never throws

### Animation Stack

1. **GSAP 3 + ScrollMagic** — homepage horizontal carousel (`useScrollEffects.ts`)
2. **CSS + IntersectionObserver** — `.reveal` / `.reveal-line` → `.visible` transitions
3. Custom hooks: `useRevealOnScroll`, `useHeroEntry`, `useHorizontalScroll`

---

## 4) Code Style

### Imports Order (strict)

1. `"use client"` directive — first if present
2. React core imports (`useState`, `useEffect`, etc.)
3. Third-party libs (`next/image`, `next/link`, `gsap`, etc.)
4. Type imports (`@/types/*`)
5. Local service imports (`@/app/lib/api`)
6. Component imports (`@/components/*`)
7. SCSS module (`styles from "./Foo.module.scss"`)
8. SVG assets (`@assets/*.svg`)

### File Naming

- **Components:** PascalCase (`PortfolioList.tsx`)
- **Hooks/Utils:** camelCase (`useScrollEffects.ts`, `api.ts`)
- **Styles:** same name as component + `.module.scss`

### Component Patterns

```typescript
// Correct
interface ComponentNameProps {
  title: string;
  items?: Item[];
}
export default function ComponentName({ title, items = [] }: ComponentNameProps) {

// Incorrect — do not use React.FC
export default const ComponentName: React.FC<ComponentNameProps> = () => {
```

### TypeScript Rules

- `strict: true` — do not weaken
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` — only for third-party interop with explanatory comment
- PayloadCMS `null` → frontend `?` via mapper layer in `api.ts`
- Refs: `useRef<HTMLDivElement>(null)` with specific HTML element type

### Constants

- Use `UPPER_SNAKE_CASE` for module-level constants
- Magic numbers: extract to named constants

### SCSS Modules

- One `.module.scss` per component directory
- **camelCase** class names: `.portfolioItem`, `.heroSection`
- **Section comments:** `/* HERO SECTION */` (uppercase, dashed lines)
- Mobile breakpoint: `variables.$bp-mobile` (768px)
- Reuse via `@use '../../global.variables' as *;`

---

## 5) Error Handling

| Context | Pattern |
|---------|---------|
| API calls | `.catch()` returns safe fallback (`[]`, `null`) |
| Server components | `try/catch` with empty fallback |
| Missing resources | `notFound()` from `next/navigation` |
| DOM refs | `if (!ref.current) return;` guard |
| Client-only code | Check `typeof window === 'undefined'` |

---

## 6) Security

### Headers (next.config.ts)

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Webhook Protection

- Rate limited: 30 req/min per IP (HTTP 429 when exceeded)
- Sanitizes response errors — no stack traces or server details

### sanitizeHtml Guard

`src/app/lib/sanitize.ts` is **client-only**. Throws error if called server-side.

---

## 7) Path Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@types/*` | `src/types/*` |
| `@components/*` | `src/app/components/*` |
| `@pages/*` | `src/app/pages/*` |
| `@assets/*` | `src/assets/*` |

---

## 8) Shared Types

Import from `@/types/*`:
- `PayloadPortfolioItem` — raw PayloadCMS API shape (service layer only)
- `PortfolioItem` — transformed frontend type (use `descriptionHTML` over EditorJS blocks)
- `PortfolioCategory`, `Teammate` — shared domain types

---

## 9) Legacy Files — DO NOT MODIFY

- `src/app/projects/[slug]/page.old.tsx`
- `src/app/projects/[slug]/ProjectDetailClient.tsx`

Use `ProjectDetailClientV2.tsx` instead.

---

## 10) Deployment

GitHub Actions on push to `main`:
1. Build with `API_URL` secret
2. Output: `standalone` (self-contained)
3. Rsync to DigitalOcean Droplet
4. PM2 serves on port 3001
