---
status: not-started
phase: 1
updated: 2026-04-01
---

# Implementation Plan

## Goal
Address critical security vulnerabilities, update outdated dependencies, and implement security best practices for the Next.js portfolio application with rollback safety, verification steps, and minimal production risk.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Prioritize Next.js 15.5.14 security patch over Next.js 16 migration | Critical RCE vulnerability (CVSS 10.0) requires immediate fix without breaking changes | `ref:ses_2b7438ba0ffeejJTzDudFFoilG` |
| Add security headers with specific values and verification | Security headers provide immediate protection but must be tested for compatibility | Analysis of next.config.ts and review feedback |
| Add client-only guard to sanitizeHtml instead of isomorphic-dompurify | sanitizeHtml is only used in client components; adding guard prevents accidental server usage | Reviewer analysis of sanitize.ts usage patterns |
| Create rollback branches for each phase | AGENTS.md states "No test framework is configured"; rollback capability mitigates risk | Reviewer risk assessment and code philosophy compliance |

## Phase 1: Critical Security Fixes [PENDING]
- [ ] **1.0 Create git branch `security-fixes` and commit current state** ← CURRENT
- [ ] 1.1 Update Next.js to security patch 15.5.14 (specific version)
- [ ] 1.1a Verification: `npm list next` shows exactly 15.5.14
- [ ] 1.2 Run `npm audit fix --audit-level=critical` for critical vulnerabilities only
- [ ] 1.2a Verification: `npm audit` shows no critical vulnerabilities
- [ ] 1.3 Add specific security headers to next.config.ts: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] 1.3a Verification: Test homepage loads without CSP errors in browser console
- [ ] 1.4 Add client-only guard to sanitizeHtml: `if (typeof window === 'undefined') throw new Error('sanitizeHtml is client-only')`
- [ ] 1.5 Remove unused scrollmagic-plugin-gsap dependency
- [ ] 1.5a Verification: homepage scroll animations still work after removal
- [ ] 1.6 Manual smoke test: homepage, /projects, /projects/[slug], /about-us pages load correctly
- [ ] 1.7 Run `npm run build` and `npm run lint` - must succeed
- [ ] 1.8 **ROLLBACK STEP**: If any step fails, revert to `security-fixes` branch start and investigate

## Phase 2: Dependency Modernization [PENDING]
- [ ] 2.0 Create git branch `dependency-updates` from updated main
- [ ] 2.1 Update React to 19.1.1 and react-dom to 19.1.1
- [ ] 2.1a Verification: `npm list react` shows 19.1.1
- [ ] 2.2 Update TypeScript to 5.9.3
- [ ] 2.3 Update @types/node to 20.19.37
- [ ] 2.4 Update GSAP to 3.14.2 and ScrollMagic to 2.0.9
- [ ] 2.5 Clean up commented imports in globals.scss (lines 5-7)
- [ ] After each update (2.1-2.4): run `npm run build` and `npm run lint`
- [ ] 2.6 Manual smoke test: homepage, projects, about-us pages with all animations working
- [ ] 2.7 **ROLLBACK STEP**: If any build fails, revert to previous working version

## Phase 3: Infrastructure Improvements [PENDING]
- [ ] 3.0 Create git branch `infrastructure-improvements`
- [ ] 3.1 Add automated security scanning to CI: `npm audit` in GitHub Actions before build
- [ ] 3.2 Add linting to pre-commit hooks via husky/lint-staged
- [ ] 3.3 Add Vitest with React Testing Library for unit tests (aligns with Vite/Turbopack ecosystem)
- [ ] 3.3a Create basic test setup and 2-3 example component tests
- [ ] 3.4 Evaluate Next.js 16 migration (research breaking changes, create separate plan)
- [ ] 3.5 Evaluate ESLint 10 migration (research compatibility, create separate plan)
- [ ] 3.6 Manual smoke test after infrastructure changes
- [ ] 3.7 Update AGENTS.md with new security configuration and testing documentation

## Phase 4: Performance & Monitoring [PENDING]
- [ ] 4.0 Create git branch `performance-optimization`
- [ ] 4.1 Re-enable image optimization with proper patterns (research why unoptimized: true was set)
- [ ] 4.1a Verification: images load correctly with optimization enabled
- [ ] 4.2 Add bundle analysis tool (@next/bundle-analyzer)
- [ ] 4.3 Implement proper caching strategies (research current cache behavior)
- [ ] 4.4 Add performance monitoring setup (basic Lighthouse CI or similar)
- [ ] 4.5 Manual smoke test: verify no performance regressions

## Notes
- 2026-04-01: Critical RCE vulnerability identified in Next.js 15.3.4 with CVSS 10.0 score - must be addressed immediately `ref:ses_2b7438ba0ffeejJTzDudFFoilG`
- 2026-04-01: Reviewer identified missing rollback strategy and verification steps - now added
- 2026-04-01: sanitizeHtml is only used in client components (HomepagePortfolioClient.tsx, legacy ProjectDetailClient.tsx) - adding guard is sufficient
- 2026-04-01: AGENTS.md explicitly states "No test framework is configured" - Phase 3 adds Vitest
- 2026-04-01: Current deployment uses manual SSH/rsync - maintain existing workflow but add safety checks
