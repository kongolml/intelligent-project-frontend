# Frontend Architecture

## Overview

Next.js 15 (App Router) + React 19 portfolio website, migrated from WordPress. Features heavy scroll-triggered animations powered by GSAP and ScrollMagic. All content is fetched from the PayloadCMS backend via its REST API.

## Tech Stack

- **Framework:** Next.js 15 with Turbopack (dev), standalone output (prod)
- **UI:** React 19, React-Bootstrap 5, SCSS Modules
- **Animations:** GSAP 3 + ScrollMagic (homepage), CSS + IntersectionObserver (project pages)
- **Sanitization:** DOMPurify for all `dangerouslySetInnerHTML` usage
- **SVGs:** Imported as React components via `@svgr/webpack`

## Routing

| Route | Description |
|-------|-------------|
| `/` | Homepage — horizontal-scroll portfolio showcase with GSAP animations |
| `/projects` | Portfolio list with category filtering |
| `/projects/[slug]` | Project detail page with reveal animations |
| `/about-us` | Team page |

## Server/Client Component Split

The app follows a strict server/client separation:

- **Server components** (default) handle async data fetching from PayloadCMS. They call service functions from `src/app/lib/api.ts`.
- **Client components** (marked `"use client"`) handle DOM manipulation, animations, and user interactivity.
- Naming convention pairs them: e.g., `HomepagePortfolioScrollable.tsx` (server) + `HomepagePortfolioScrollableClient.tsx` (client).

## Data Flow

```
PayloadCMS REST API
        ↓
  src/app/lib/api.ts  (service layer)
        ↓
  Server Components   (fetch data, pass as props)
        ↓
  Client Components   (render UI, handle animations)
```

### Service Layer (`src/app/lib/api.ts`)

The service layer:
1. Fetches from `${API_URL}/api/{collection-slug}` using Next.js `fetch` with cache tags
2. Unwraps PayloadCMS paginated responses (`data.docs`)
3. Transforms data to match frontend types (e.g., `name` → `title`, media relationships → URLs)
4. Handles errors gracefully, returning empty arrays on failure

Available functions:
- `getPortfolioItems()` — all portfolio items
- `getPortfolioShowcases()` — items with `isShowcase: true` (homepage)
- `getPortfolioItemBySlug(slug)` — single item by slug
- `getPortfolioCategories()` — all categories
- `getTeammates()` — all team members

### Caching & Revalidation

Two-layer cache invalidation strategy:

1. **On-demand revalidation via webhook** — PayloadCMS sends POST requests to `/api/webhook` after content changes. The webhook handler calls `revalidateTag()` to invalidate the relevant cache tag.
2. **Fallback time-based revalidation** — every 3600 seconds (1 hour) as a safety net if webhook delivery fails.

The webhook endpoint at `src/app/api/webhook/route.ts` validates requests using a shared `PAYLOAD_WEBHOOK_SECRET` header.

## Animation Systems

### 1. GSAP + ScrollMagic (Homepage)

The `useScrollEffects` hook (`src/app/hooks/useScrollEffects.ts`) orchestrates:
- Horizontal scroll carousel
- Text scramble effects (ScrambleTextPlugin)
- Hero fade animations
- Active slide tracking

GSAP plugins (ScrambleTextPlugin, MotionPathPlugin, ScrollTrigger) are registered before use.

### 2. CSS + IntersectionObserver (Project Pages)

Used in `ProjectDetailClientV2`:
- Elements with `.reveal` or `.reveal-line` classes get `.visible` added when entering viewport
- Hero elements animate via `setTimeout` stagger on mount
- No GSAP dependency

## Styling

- **SCSS Modules** (`.module.scss`) for component-scoped styles
- **Bootstrap 5 / React-Bootstrap** for grid and UI components
- **Global design tokens** in `src/app/global.variables.scss` (colors, spacing, typography)
- **Shared mixins** in `src/app/styles/mixins.scss`
- **Mobile breakpoint:** 768px

## Path Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@types/*` | `src/types/*` |
| `@components/*` | `src/app/components/*` |
| `@pages/*` | `src/app/pages/*` |
| `@assets/*` | `src/assets/*` |

`@assets` also has a Turbopack `resolveAlias` in `next.config.ts`.

## Types

Shared TypeScript types live in `src/types/`:
- `portfolio.types.ts` — `PortfolioItem`, `PortfolioCategory`, `EditorJSDataBlock`
- `teammate.types.ts` — `Teammate`
- `payload.types.ts` — raw PayloadCMS response shapes

`PortfolioItem` has two description fields: `description` (EditorJS block array) and `descriptionHTML` (pre-rendered HTML string). Client components use `descriptionHTML` for rendering.

## Image Handling

- Next.js Image component with `unoptimized: true`
- Remote patterns configured for `fra1.digitaloceanspaces.com` and `behance.net`
- SVGs imported as React components via `@svgr/webpack` (configured for both webpack and Turbopack)
