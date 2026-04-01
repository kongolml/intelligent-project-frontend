# Performance Optimization Learnings

## Phase 4: Performance & Monitoring

### Why `unoptimized: true` was set
- Commit `867dae2` ("caching POC") added `unoptimized: true` to next.config.ts
- It was part of a Proof of Concept for caching with standalone output + PM2 deployment
- The setting was never reverted after the POC completed

### Image Optimization Decision
- Re-enabled image optimization by removing `unoptimized: true`
- Next.js 15.5.14+ handles image optimization properly with standalone output
- Added explicit `deviceSizes`, `imageSizes`, and `formats` (AVIF, WebP) for better control
- Remote patterns already configured for DigitalOcean Spaces and Behance CDN

### Bundle Analyzer
- Added `@next/bundle-analyzer` as dev dependency
- Created `npm run analyze` script (runs with `ANALYZE=true next build`)
- Bundle stats output to `.next/analyze.html` after build

### Caching Headers
- Static assets (images, fonts, icons): `public, max-age=31536000, immutable`
- `/_next/static/`: `public, max-age=31536000, immutable` (hashed filenames are immutable)
- Applied via next.config.ts headers function

### Lighthouse CI
- Created `.github/workflows/lighthouse.yml` for PR performance checks
- Created `lighthouserc.json` with performance budgets
- Thresholds: performance 0.8, accessibility 0.9, best-practices 0.85, seo 0.9
- Uses treosh/lighthouse-ci-action@v11

### Lockfile Warning
- There's a `package-lock.json` in parent directory `/Users/kostiantyngolosov/work/`
- Causes "multiple lockfiles" warning in Next.js
- Not critical - build works fine
- Could fix by adding `outputFileTracingRoot` to next.config.ts if needed
