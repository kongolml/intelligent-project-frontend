# HomepageCases Implementation Plan

## Status: Ready for implementation

## Summary
Replace HomepageSplit with a new HomepageCases component featuring a Joffrey Spitzer-inspired scroll-driven cases slider, aligned with the ProjectDetailClientV2 editorial design system.

## Files to Create

### 1. `src/app/components/HomepageCases/HomepageCases.tsx`
Server component. Fetches showcase portfolio items, passes to client.

### 2. `src/app/components/HomepageCases/HomepageCasesClient.tsx`
Client component with 5 sections: Hero, Cases Slider, Manifesto, Capabilities, CTA.

### 3. `src/app/components/HomepageCases/HomepageCases.module.scss`
All styles. Uses warm editorial palette from ProjectDetailClientV2.

### 4. `src/app/components/HomepageCases/hooks/useRevealOnScroll.ts`
IntersectionObserver for .reveal and .reveal-line elements.

### 5. `src/app/components/HomepageCases/hooks/useHeroEntry.ts`
ScrambleText + hero staggered reveals + scroll rounding.

### 6. `src/app/components/HomepageCases/hooks/useCasesScrollAnimation.ts`
GSAP ScrollTrigger for cases slider image reveals + active title tracking.

## File to Modify

### `src/app/page.tsx`
Replace `<HomepageSplit />` with `<HomepageCases />`.

## Design Tokens
- $black: #0a0a0a, $white: #f5f2ed, $cream: #ece8e1, $page-bg: #dedad2, $accent: #c44a2f
- Fonts: DM Serif Display, Instrument Sans, JetBrains Mono
- Animation ease: cubic-bezier(0.23, 1, 0.32, 1)

## Approved: Yes
