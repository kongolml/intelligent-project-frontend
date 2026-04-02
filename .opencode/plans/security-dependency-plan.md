---
status: completed
phase: 4
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

## Phase 1: Critical Security Fixes [COMPLETED]
- [x] **1.0 Create git branch `security-fixes` and commit current state**
- [x] 1.1 Update Next.js to security patch 15.5.14 (specific version)
- [x] 1.1a Verification: `npm list next` shows exactly 15.5.14
- [x] 1.2 Run `npm audit fix --audit-level=critical` for critical vulnerabilities only
- [x] 1.2a Verification: `npm audit` shows no critical vulnerabilities
- [x] 1.3 Add specific security headers to next.config.ts: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] 1.3a Verification: Test homepage loads without CSP errors in browser console
- [x] 1.4 Add client-only guard to sanitizeHtml: `if (typeof window === 'undefined') throw new Error('sanitizeHtml is client-only')`
- [x] 1.5 Remove unused scrollmagic-plugin-gsap dependency
- [x] 1.5a Verification: homepage scroll animations still work after removal
- [x] 1.6 Fix info-leaking fields from /api/webhook/health endpoint
- [x] 1.7 Remove error details from webhook error response
- [x] 1.8 Manual smoke test: homepage, /projects, /projects/[slug], /about-us pages load correctly
- [x] 1.9 Run `npm run build` and `npm run lint` - must succeed

## Phase 2: Dependency Modernization [COMPLETED]
- [x] 2.0 Create git branch `dependency-updates` from updated main
- [x] 2.1 Update React to 19.1.1 and react-dom to 19.1.1
- [x] 2.1a Verification: `npm list react` shows 19.1.1
- [x] 2.2 Update TypeScript to 5.9.3
- [x] 2.3 Update @types/node to 20.19.37
- [x] 2.4 Update GSAP to 3.14.2 and ScrollMagic to 2.0.9
- [x] 2.5 Clean up commented imports in globals.scss (lines 5-7)
- [x] After each update (2.1-2.4): run `npm run build` and `npm run lint`
- [x] 2.6 Manual smoke test: homepage, projects, about-us pages with all animations working

## Phase 3: Infrastructure Improvements [COMPLETED]
- [x] 3.0 Create git branch `infrastructure-improvements`
- [x] 3.1 Add automated security scanning to CI: `npm audit` in GitHub Actions before build
- [x] 3.2 Add linting to pre-commit hooks via husky/lint-staged
- [x] 3.3 Add Vitest with React Testing Library for unit tests (aligns with Vite/Turbopack ecosystem)
- [x] 3.3a Create basic test setup and 2-3 example component tests
- [x] 3.4 Evaluate Next.js 16 migration (research breaking changes, create separate plan)
- [x] 3.5 Add rate limiting to webhook endpoints
- [x] 3.6 Manual smoke test after infrastructure changes
- [x] 3.7 Update AGENTS.md with new security configuration and testing documentation

## Phase 4: Performance & Monitoring [COMPLETED]
- [x] **4.0 Create git branch `performance-optimization`**
- [x] 4.1 Re-enable image optimization with proper patterns (research why unoptimized: true was set)
- [x] 4.1a Verification: images load correctly with optimization enabled
- [x] 4.2 Add bundle analysis tool (@next/bundle-analyzer)
- [x] 4.3 Implement proper caching strategies (research current cache behavior)
- [x] 4.4 Add performance monitoring setup (basic Lighthouse CI or similar)
- [x] 4.5 Manual smoke test: verify no performance regressions

## Final Verification Wave [COMPLETED]
- [x] F1: Security Review - **APPROVED** - All security headers present, no info leaks, sanitizeHtml guard works
- [x] F2: Build Verification - **APPROVED** - Full build passes, no TypeScript errors, tests pass
- [x] F3: Dependency Audit - **APPROVED** - npm audit shows 0 critical vulnerabilities
- [x] F4: Documentation Review - **APPROVED** - AGENTS.md updated with all security and performance documentation

## Notes
- 2026-04-01: Critical RCE vulnerability identified in Next.js 15.3.4 with CVSS 10.0 score - must be addressed immediately `ref:ses_2b7438ba0ffeejJTzDudFFoilG`
- 2026-04-01: Reviewer identified missing rollback strategy and verification steps - now added
- 2026-04-01: sanitizeHtml is only used in client components (HomepagePortfolioClient.tsx, legacy ProjectDetailClient.tsx) - adding guard is sufficient
- 2026-04-01: AGENTS.md explicitly states "No test framework is configured" - Phase 3 adds Vitest
- 2026-04-01: Current deployment uses manual SSH/rsync - maintain existing workflow but add safety checks
