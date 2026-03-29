# Homepage Direction B: "Orbiting Projects"

## Concept

Projects orbit around a central point (the agency logo/name). The orbit responds to scroll velocity and direction. Hovering "catches" a project and brings it into focus.

## Visual Reference

```
                    ○ Project 4
                  ╱
    Project 1  ○
              ╲    ● Center
                ╲   (logo)
    Project 2  ○   ╲
                    ○ Project 5
                  ╱
    Project 3  ○

[Scroll ↓] → Orbit rotates clockwise
[Scroll ↑] → Orbit rotates counter-clockwise
[Hover project] → Orbit pauses, project scales up
```

## GSAP Animation Breakdown

| Moment | Animation | Trigger |
|--------|-----------|---------|
| Page load | Projects fly in from edges, settle into orbit | auto |
| Scroll | Orbit rotates based on scroll direction/velocity | ScrollTrigger |
| Hover project | Orbit pauses, hovered project scales 1.3x | mouseenter |
| Click project | Project flies to center, transforms to card | click |
| Scroll past hero | Orbit accelerates, projects fly off screen | ScrollTrigger |

---

## Component Structure

```
src/app/components/HomepageOrbit/
├── HomepageOrbit.tsx
├── HomepageOrbitClient.tsx
├── HomepageOrbit.module.scss
├── components/
│   ├── OrbitContainer.tsx         # The 3D space
│   ├── OrbitCenter.tsx             # Logo/brand in center
│   ├── OrbitingProject.tsx         # Individual orbiting item
│   ├── OrbitControls.tsx           # Optional: manual controls
│   └── ProjectDetailOverlay.tsx     # Click-to-expand
├── sections/
│   ├── HeroOrbit.tsx               # The orbit scene
│   ├── ManifestoSimple.tsx         # Standard below
│   └── ProjectsGrid.tsx            # Standard grid below
└── hooks/
    ├── useOrbitAnimation.ts        # GSAP orbit logic
    └── useScrollVelocity.ts        # Track scroll speed
```

---

## Key GSAP Code Patterns

```typescript
// useOrbitAnimation.ts
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OrbitConfig {
  radius?: number;
  rotationSpeed?: number;
}

export function useOrbitAnimation(
  containerRef: RefObject<HTMLElement>,
  projectsCount: number,
  config: OrbitConfig = {}
) {
  const {
    radius = Math.min(typeof window !== "undefined" ? window.innerWidth : 800, 800) * 0.35,
    rotationSpeed = 0.5
  } = config;

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const projects = gsap.utils.toArray<HTMLElement>(".orbiting-project");
    let currentRotation = 0;
    let animationFrame: number;

    // Initial placement in orbit
    projects.forEach((project, i) => {
      const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.5; // Flatten for perspective

      gsap.set(project, {
        x: x,
        y: y,
        attr: { "data-angle": angle.toString() }
      });
    });

    // Entrance animation - fly in from edges
    gsap.from(projects, {
      scale: 0,
      opacity: 0,
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.1
    });

    // Scroll-based rotation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        currentRotation += velocity * 0.0001 * rotationSpeed;

        projects.forEach((project, i) => {
          const baseAngle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
          const angle = baseAngle + currentRotation;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;
          const scale = 0.8 + (Math.sin(angle) + 1) * 0.2; // Depth perception
          const zIndex = Math.round((Math.sin(angle) + 1) * 10);

          gsap.to(project, {
            x,
            y,
            scale,
            zIndex,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      }
    });

    // Hover handlers
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1.3,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        duration: 0.3
      });
      gsap.to(projects.filter(p => p !== target), {
        opacity: 0.5,
        duration: 0.3
      });
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        duration: 0.3
      });
      gsap.to(projects, {
        opacity: 1,
        duration: 0.3
      });
    };

    projects.forEach(project => {
      project.addEventListener("mouseenter", handleMouseEnter);
      project.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      scrollTrigger.kill();
      projects.forEach(project => {
        project.removeEventListener("mouseenter", handleMouseEnter);
        project.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [radius, rotationSpeed, projectsCount]);
}
```

```typescript
// useScrollVelocity.ts
import { useEffect, useRef, useState } from "react";

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const timeDelta = currentTime - lastTime.current;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (timeDelta > 0) {
        const newVelocity = scrollDelta / timeDelta;
        setVelocity(newVelocity);
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return velocity;
}
```

---

## SCSS Structure

```scss
// HomepageOrbit.module.scss

$black: #0a0a0a;
$white: #f5f2ed;
$cream: #ece8e1;
$accent: #c44a2f;
$forest: #2d4a3e;
$page-bg: #dedad2;

$font-display: 'DM Serif Display', serif;
$font-body: 'Instrument Sans', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

.orbitContainer {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: $page-bg;
  perspective: 1000px;
}

.orbitRing {
  position: absolute;
  width: 70vmin;
  height: 35vmin;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.orbitRingInner {
  @extend .orbitRing;
  width: 50vmin;
  height: 25vmin;
}

.orbitCenter {
  position: relative;
  z-index: 10;
  text-align: center;
}

.orbitLogo {
  font-family: $font-display;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.orbitTagline {
  font-family: $font-mono;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $accent;
}

.orbitingProject {
  position: absolute;
  width: 160px;
  height: 200px;
  background: $white;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  will-change: transform;

  &:hover {
    z-index: 100 !important;
  }
}

.orbitingProjectImage {
  position: relative;
  width: 100%;
  height: 120px;
  background: $cream;
}

.orbitingProjectInfo {
  padding: 12px;
}

.orbitingProjectCategory {
  font-family: $font-mono;
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $accent;
  margin-bottom: 4px;
}

.orbitingProjectTitle {
  font-family: $font-display;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.3;
}

// Scroll indicator
.orbitScrollIndicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: $black;
  font-family: $font-mono;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

// Below fold sections
.belowFold {
  background: $white;
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
}

.manifestoSection {
  max-width: 800px;
  margin: 0 auto 100px;
}

.manifestoTitle {
  font-family: $font-display;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.manifestoText {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #3a3a38;
}

// Responsive
@media (max-width: 768px) {
  .orbitingProject {
    width: 120px;
    height: 160px;
  }

  .orbitingProjectImage {
    height: 90px;
  }

  .orbitingProjectTitle {
    font-size: 0.75rem;
  }

  .orbitRing,
  .orbitRingInner {
    display: none;
  }
}
```

---

## Component Implementation

### HomepageOrbit.tsx (Server)

```typescript
import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageOrbitClient from "./HomepageOrbitClient";

export default async function HomepageOrbit() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageOrbitClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
```

### HomepageOrbitClient.tsx (Client)

```typescript
"use client";

import { useRef } from "react";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageOrbit.module.scss";
import { useOrbitAnimation } from "./hooks/useOrbitAnimation";
import Image from "next/image";
import Link from "next/link";

interface HomepageOrbitClientProps {
  portfolioItems: PortfolioItem[];
}

export default function HomepageOrbitClient({ portfolioItems }: HomepageOrbitClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  useOrbitAnimation(containerRef, portfolioItems.length);

  return (
    <>
      <section ref={containerRef} className={styles.orbitContainer}>
        <div className={styles.orbitRing} />
        <div className={styles.orbitRingInner} />

        <div className={styles.orbitCenter}>
          <h1 className={styles.orbitLogo}>Intelligent Project</h1>
          <p className={styles.orbitTagline}>Студія брендингу та дизайну</p>
        </div>

        {portfolioItems.map((item, index) => (
          <Link
            key={item.id}
            href={`/projects/${item.slug}`}
            className={`${styles.orbitingProject} orbiting-project`}
          >
            <div className={styles.orbitingProjectImage}>
              {item.main_image && (
                <Image
                  src={item.main_image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className={styles.orbitingProjectInfo}>
              <div className={styles.orbitingProjectCategory}>
                {item.categories[0]?.name || "Брендинг"}
              </div>
              <h3 className={styles.orbitingProjectTitle}>{item.title}</h3>
            </div>
          </Link>
        ))}

        <div className={styles.orbitScrollIndicator}>
          <span>Скрольте</span>
          <span>↓</span>
        </div>
      </section>

      <div className={styles.belowFold}>
        <section className={styles.manifestoSection}>
          <h2 className={styles.manifestoTitle}>
            Дизайн — це не прикраса. Це стратегічна думка.
          </h2>
          <p className={styles.manifestoText}>
            Ми створюємо бренди, які не просто виглядають добре — вони працюють.
            Кожне рішення базується на стратегії, кожна деталь має значення.
          </p>
        </section>

        <section className={styles.ctaSection}>
          <Link href="/projects" className={styles.ctaLink}>
            Переглянути всі проєкти →
          </Link>
        </section>
      </div>
    </>
  );
}
```

---

## Technical Challenges

1. **3D positioning**: Making orbits feel 3D requires careful perspective handling
2. **Scroll velocity tracking**: Need to smooth scroll input for natural rotation
3. **Touch/mobile**: Orbit rotation via touch drag vs scroll
4. **Project ordering**: When a project is clicked, bringing it to front z-index

## Estimated Complexity: High

---

## Usage

To use this direction, update `src/app/page.tsx`:

```typescript
import HomepageOrbit from "./components/HomepageOrbit/HomepageOrbit";

export default function Home() {
  return <HomepageOrbit />;
}
```
