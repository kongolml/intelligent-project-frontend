---
status: paused
phase: 3
updated: 2026-04-02
---

# Implementation Plan

## Goal
Upgrade Next.js from 15.5.14 to 16.2 addressing all breaking changes with full smoke testing.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Upgrade to 16.2 (latest) | March 2026 release, all security patches | `ref:fiscal-blue-wasp` |
| Create upgrade branch from current branch | Preserve existing work on current branch | User request |
| Full smoke test before merging | Animation libraries are the wild card | `ref:fiscal-blue-wasp` (medium risk) |
| Update revalidateTag calls first | Simplest change, validates the pattern | `ref:fiscal-blue-wasp` |

## Phase 1: Pre-Upgrade Setup [COMPLETED]
- [x] 1.1 Determine current branch and ensure clean working directory
- [x] 1.2 Create git branch `feature/nextjs16-upgrade` from current branch
- [x] 1.3 Run `npm run build` — must pass before starting

## Phase 2: Breaking Changes [COMPLETED]
- [x] 2.1 Verify `revalidateTag` calls need updating (confirmed: Next.js 16 requires 2nd argument)
- [x] 2.2 Review `next.config.ts` image defaults — specifically check `minimumCacheTTL`, `qualities`, `maximumRedirects` against new Next.js 16 defaults ✓ No changes needed for Next.js 16
- [x] 2.3 Verify lint script in `package.json` — if `next lint` breaks, switch to direct ESLint ✓ Fixed: Updated to use ESLint directly, installed missing plugins, configured properly

## Phase 3: Package Update [COMPLETED]
- [x] 3.1 Update Next.js: `npm install next@16.2.0`
- [x] 3.1a Verification: `npm list next` shows 16.2.0
- [x] 3.2 Update `@next/bundle-analyzer` to match: `npm install @next/bundle-analyzer@16.2.0`
- [x] 3.3 Update React to 19.2.x (comes with Next.js 16): `npm install react@19.2.1 react-dom@19.2.1`
- [x] 3.4 Run `npm install` to resolve all peer dependencies
- [x] 3.5 Update `revalidateTag` calls for Next.js 16: `revalidateTag(tag)` → `revalidateTag(tag, 'max')` in both route files
- [x] 3.6 Run `npm run build` — must succeed
- [x] 3.7 Run `npm run lint` — must succeed

## Phase 4: Testing [PENDING]
- [ ] 4.1 Homepage: verify page loads, horizontal scroll carousel works, GSAP animations trigger
- [ ] 4.2 `/projects`: verify category filtering works, images load
- [ ] 4.3 `/projects/[slug]`: verify project detail page renders, description HTML displays, images load
- [ ] 4.4 `/about-us`: verify team page renders
- [ ] 4.5 Test webhook revalidation: trigger `/api/webhook` and verify `portfolio-items` cache is invalidated
- [ ] 4.6 Test navigation: verify client-side navigation between all pages works
- [ ] 4.7 Run `npm run analyze` — compare bundle size to baseline

## Phase 5: Finalization [PENDING]
- [ ] 5.1 Review bundle analyzer output — no unexpected size increases
- [ ] 5.2 If all tests pass: push branch and create PR
- [ ] 5.3 If issues found: debug and repeat Phase 4

## Rollback Plan
- If build fails or critical issues appear:
  1. `git checkout <original-branch>`
  2. `git branch -D feature/nextjs16-upgrade`
  3. `npm install` (restore node_modules to original state)
- If runtime issues: keep branch open, investigate separately

## Notes
- 2026-04-02: User requested plan after exploring pros/cons — confirmed upgrade desired `ref:fiscal-blue-wasp`
- Turbopack already in use — easier transition
- Async params already compatible — no page component changes needed
- GSAP/ScrollMagic animation testing is the key risk item
- 2026-04-02: Branch to be created from current branch (not main) per user request
- 2026-04-02: Phase 1 completed successfully, branch created
- 2026-04-02: Phase 2.1 and 2.2 completed (revalidateTag updated for Next.js 16)
- 2026-04-02: ESLint configuration fixed: `next lint` is deprecated in Next.js 16, migrated to direct ESLint with proper plugins
- 2026-04-02: Installed and configured `@next/eslint-plugin-next`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- 2026-04-02: ESLint now properly excludes .next directory and checks only source files
- 2026-04-02: Phase 3 completed - Next.js 16.2.0, React 19.2.1, @next/bundle-analyzer 16.2.0 all installed. All revalidateTag calls updated. Build and lint pass.
- Phases 1-3 complete. Phases 4-5 pending (user requested pause).
