# Project Improvement Plan

## Context

The project is a Next.js 15 portfolio/showcase website migrated from WordPress. The analysis revealed security vulnerabilities (XSS, hardcoded URLs, HTTP CDN), missing best practices (no error handling, no `next/link`, placeholder metadata), and significant code debt (300+ lines of commented-out code, dead files, PHP remnants). This plan organizes fixes into phases ordered by impact and risk.

---

## Phase 1: Critical Security & Configuration ✅ COMPLETED

**Goal:** Fix security vulnerabilities and make the app deployable beyond localhost.

### 1.1 Environment variables for API URL ✅
- Created `.env.local` with `API_URL=http://localhost:3000`
- Created `.env.example` as a template for other developers
- Created `src/app/lib/api.ts` with `getApiUrl()` helper
- Updated all hardcoded `http://localhost:3000` fetch calls in 6 files

### 1.2 XSS protection with DOMPurify ✅
- Installed `dompurify` and `@types/dompurify`
- Created `src/app/lib/sanitize.ts` with `sanitizeHtml()` utility
- Applied sanitization to `dangerouslySetInnerHTML` in:
  - `src/app/projects/[slug]/ProjectDetailClient.tsx` (EditorJS paragraph blocks)
  - `src/app/components/HomepagePortfolio/HomepagePortfolioClient.tsx` (portfolio description)

### 1.3 Fix HTTP CDN link ✅
- `src/app/page.tsx` — Changed `http://cdnjs.cloudflare.com/...` to `https://`

**Note:** Pre-existing build errors remain in `Header.module.scss` and `ProjectDetail.module.scss` (`:global()` selector purity issues) — not introduced by Phase 1.

---

## Phase 2: Error Handling & Resilience

**Goal:** Prevent crashes when the backend API is unavailable.

### 2.1 Add try/catch to all server-side fetches
- Wrap fetch calls in try/catch in all server components
- Return sensible fallbacks (empty arrays) or call `notFound()`
- Files:
  - `src/app/page.tsx`
  - `src/app/projects/page.tsx`
  - `src/app/about-us/page.tsx`
  - `src/app/components/HomepagePortfolio/HomepagePortfolio.tsx`
  - `src/app/components/HomepagePortfolioScrollable/HomepagePortfolioScrollable.tsx`

### 2.2 Add error boundaries
- Create `src/app/error.tsx` (root error boundary)
- Create `src/app/projects/error.tsx`
- Create `src/app/projects/[slug]/not-found.tsx` (custom 404)

### 2.3 Add loading states
- Create `src/app/projects/loading.tsx`
- Create `src/app/projects/[slug]/loading.tsx`

**Files modified:** 5 files + 4-5 new files

---

## Phase 3: Next.js Best Practices

**Goal:** Use Next.js features correctly for performance and SEO.

### 3.1 Fix metadata
- `src/app/layout.tsx` — Update title to "Intelligent Project" and description to something meaningful

### 3.2 Use `next/link` in Header
- `src/app/components/Header/Header.tsx` — Replace `<a href>` with `<Link href>` for all navigation links

### 3.3 Fix font loading
- `src/app/layout.tsx` — Remove the raw `<style>@import url(...)</style>` block from `<head>`
- Use `next/font/google` for Sora (primary UI font) or at minimum use `<link>` with `preconnect` instead of render-blocking `@import`
- Remove unused Geist font imports

### 3.4 Add caching strategy to fetches
- Add `next: { revalidate: 60 }` (ISR) to fetch calls that don't need real-time data:
  - Homepage portfolio categories
  - Homepage showcases
  - Portfolio categories on projects page
- Keep `cache: "no-store"` for portfolio list (already set)

**Files modified:** ~6 files

---

## Phase 4: Code Cleanup

**Goal:** Remove dead code and improve readability.

### 4.1 Remove commented-out code
- `src/app/components/PortfolioList/PortfolioList.tsx` — Remove ~150 lines of commented GSAP experiments
- `src/app/hooks/useScrollEffects.ts` — Remove ~50 lines of commented circle animation
- `src/app/components/HomepagePortfolio/HomepagePortfolioClient.tsx` — Remove PHP template comments and commented-out code
- `src/app/components/HomepagePortfolioScrollable/HomepagePortfolioScrollableClient.tsx` — Clean up comments
- `src/app/projects/page.tsx` — Remove commented-out JSX

### 4.2 Delete dead files
- Delete `src/app/projects/[slug]/page.old.tsx`
- Delete `src/app/hooks/useScrollEffects.gemini.ts` (if confirmed unused outside of `HomepagePortfolioClient.tsx`)
- If `HomepagePortfolio/` component pair is unused (commented out in page.tsx), delete the entire directory

### 4.3 Remove unused imports
- `src/app/components/HomepagePortfolioScrollable/HomepagePortfolioScrollable.tsx` — Remove unused `PortfolioCategory` import
- `src/app/page.tsx` — Remove unused `Script` if CDN scripts are consolidated
- Clean up any other unused imports found during cleanup

### 4.4 Fix hydration mismatch
- `src/app/components/HomepagePortfolio/HomepagePortfolioClient.tsx:23` — Move `window.innerWidth` check into `useEffect` + `useState` (same pattern as `HomepagePortfolioScrollableClient.tsx`)

**Files modified:** ~8 files, 2-3 files deleted

---

## Phase 5: Architecture Improvements (Optional)

**Goal:** Structural improvements for maintainability. Can be done incrementally.

### 5.1 Consolidate GSAP/ScrollMagic loading
- Remove CDN `<Script>` tags from `src/app/page.tsx` for GSAP and ScrollMagic (they're already npm dependencies)
- Ensure all GSAP/ScrollMagic usage comes from npm imports only
- Remove `/public/vendor/scroll-magic/animation.gsap.js` if the npm `scrollmagic-plugin-gsap` package covers it

### 5.2 Replace direct DOM queries with refs
- `src/app/hooks/useScrollEffects.ts` — Audit `document.querySelector` calls and replace with refs where possible (e.g., `.scroll-to-services`, `.slide-controls li`)
- `src/app/components/PortfolioList/PortfolioList.tsx` — Replace `document.querySelector` calls with refs

### 5.3 Add ESLint config
- Add `.eslintrc.json` with Next.js recommended rules + `no-console` warning
- Consider adding Prettier for consistent formatting

### 5.4 Fix random shuffle caching issue
- `src/app/components/HomepagePortfolioScrollable/HomepagePortfolioScrollable.tsx` — The `Math.random()` shuffle on the server breaks caching. Consider shuffling client-side or using a seed-based approach.

**Files modified:** ~5 files

---

## Verification

After each phase:
1. Run `npm run build` — ensure no build errors
2. Run `npm run dev` — verify pages render correctly
3. Run `npm run lint` — check for lint errors
4. Manual smoke test: visit `/`, `/projects`, `/projects/[any-slug]`, `/about-us`

---

## Summary

| Phase | Focus | Priority | Effort |
|-------|-------|----------|--------|
| 1 | Security & Config | P0 - Critical | ✅ Done |
| 2 | Error Handling | P1 - High | ~45 min |
| 3 | Next.js Best Practices | P1 - High | ~30 min |
| 4 | Code Cleanup | P2 - Medium | ~30 min |
| 5 | Architecture (Optional) | P3 - Low | ~1-2 hours |
