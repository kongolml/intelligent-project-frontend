# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server with Turbopack
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint via Next.js

No test framework is configured.

## Environment Setup

Requires `API_URL` env var. Copy `.env.example` to `.env.local`:
```
API_URL=http://localhost:3000
```
The helper `src/app/lib/api.ts` (`getApiUrl()`) reads this and throws if unset.

## Architecture

**Next.js 15 (App Router) + React 19** portfolio/showcase website migrated from WordPress, with heavy scroll-triggered animations.

### Data Flow

Server components call service functions from `src/app/lib/api.ts` which fetch from the PayloadCMS REST API at `${API_URL}/api/{collection-slug}` (collections: `portfolio-items`, `portfolio-categories`, `teammates`). The service layer unwraps PayloadCMS paginated responses and transforms data to match frontend types (e.g., `name`→`title`, media relationships→URLs). Data is passed as props to client components that handle animations and interactivity. All `dangerouslySetInnerHTML` usage is sanitized via `src/app/lib/sanitize.ts` (DOMPurify wrapper).

### Routing

- `/` — Homepage (horizontal-scroll portfolio showcase)
- `/projects` — Portfolio list with category filtering
- `/projects/[slug]` — Project detail page
- `/about-us` — Team page

### Animation Stack

Two animation systems are in use:

1. **GSAP 3 + ScrollMagic** — powers the homepage horizontal carousel. The `useScrollEffects` hook (`src/app/hooks/useScrollEffects.ts`) is the central orchestrator, managing horizontal scroll, text scramble effects, hero fade, and active slide tracking. GSAP plugins (ScrambleTextPlugin, MotionPathPlugin, ScrollTrigger) must be registered before use.

2. **CSS + IntersectionObserver** — used in the project detail page (`ProjectDetailClientV2`). Elements with `.reveal` or `.reveal-line` classes get `.visible` added when they enter the viewport. Hero elements animate via `setTimeout` stagger on mount. No GSAP dependency for this pattern.

### Server/Client Component Split

Server components (default) handle async data fetching. Client components (marked `"use client"`) handle DOM manipulation, animations, and interactivity. The naming convention pairs them: e.g., `HomepagePortfolioScrollable.tsx` (server) + `HomepagePortfolioScrollableClient.tsx` (client).

### Styling

- SCSS Modules (`.module.scss`) for component-scoped styles
- Bootstrap 5 / React-Bootstrap for grid and UI components
- Global design tokens in `src/app/global.variables.scss` (colors, spacing, typography)
- Shared mixins in `src/app/styles/mixins.scss`
- Mobile breakpoint: 768px

### Path Aliases (tsconfig)

- `@/*` → `src/*`
- `@types/*` → `src/types/*`
- `@components/*` → `src/app/components/*`
- `@pages/*` → `src/app/pages/*`
- `@assets/*` → `src/assets/*`

Note: `@assets` also has a Turbopack `resolveAlias` in `next.config.ts` for bundler-level resolution.

### Types

Shared TypeScript types live in `src/types/` (e.g., `portfolio.types.ts`, `teammate.types.ts`). Import via `@types/*` alias.

`PortfolioItem` has two description fields: `description` (EditorJS block array) and `descriptionHTML` (pre-rendered HTML string). Client components should prefer `descriptionHTML` for rendering via `dangerouslySetInnerHTML`.

### Legacy Files

`src/app/projects/[slug]/page.old.tsx` and `ProjectDetailClient.tsx` are superseded by `ProjectDetailClientV2.tsx` (the active component). Do not modify the old files.

### Image Handling

Next.js Image optimization with remote patterns configured for `fra1.digitaloceanspaces.com` and `behance.net`. SVGs are imported as React components via `@svgr/webpack` (Turbopack rules in `next.config.ts`).
