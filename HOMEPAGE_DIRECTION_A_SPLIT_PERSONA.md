# Homepage Direction A: "Split-Persona"

## Concept

A dramatic vertical divide that splits the viewport. The left side is dark (strategy/text), the right side is light (visuals/projects). As you scroll, the split line moves and transforms, creating a dynamic reveal effect.

## Visual Reference

```
HERO (initial state):
┌──────────────────────┬──────────────────────┐
│██████████████████████│                      │
│█████ INTELLIGENT ████│    [empty/light]     │
│█████   PROJECT   ████│                      │
│██████████████████████│                      │
└──────────────────────┴──────────────────────┘

AFTER SCROLL:
┌────────────────────────────────────────────┐
│████████                    [Project 1]     │
│████ Strategy meets visual                  │
│████ excellence           [Project 2]       │
│████████                                    │
└────────────────────────────────────────────┘
```

## GSAP Animation Breakdown

| Moment | Animation | Trigger |
|--------|-----------|---------|
| Page load | Split line animates from left | auto |
| Scroll hero | Left side compresses, right fills | ScrollTrigger |
| Text reveals | Letters slide in from behind split | stagger |
| Project cards | Slide in from right, clipped by split | ScrollTrigger |
| Hover on card | Card lifts, split line respects it | mouseenter |
| Manifesto section | Split transforms to horizontal | ScrollTrigger |

---

## Component Structure

```
src/app/components/HomepageSplit/
├── HomepageSplit.tsx              # Server - fetches data
├── HomepageSplitClient.tsx        # Client - orchestrates
├── HomepageSplit.module.scss      # Styles
├── components/
│   ├── SplitContainer.tsx         # The split wrapper
│   ├── DarkSide.tsx               # Left: text, philosophy
│   ├── LightSide.tsx              # Right: projects, visuals
│   ├── SplitLine.tsx              # The animated divider
│   └── ProjectCard.tsx            # Individual project
├── sections/
│   ├── HeroSplit.tsx
│   ├── ManifestoSplit.tsx
│   └── ProjectsSplit.tsx
└── hooks/
    └── useSplitAnimation.ts       # GSAP logic
```

---

## Key GSAP Code Patterns

```typescript
// useSplitAnimation.ts
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSplitAnimation(
  containerRef: RefObject<HTMLElement>,
  splitLineRef: RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (!containerRef.current || !splitLineRef.current) return;

    // Split line moves on scroll
    gsap.to(splitLineRef.current, {
      x: "-60vw",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-split-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    // Text reveals from split
    gsap.from(".dark-text", {
      x: -100,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".hero-split-section",
        start: "20% top",
        toggleActions: "play none none reverse"
      }
    });

    // Projects slide in, clipped by split
    gsap.from(".project-card-split", {
      x: 200,
      opacity: 0,
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".projects-split-section",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.5
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}
```

---

## SCSS Structure

```scss
// HomepageSplit.module.scss

$black: #0a0a0a;
$white: #f5f2ed;
$cream: #ece8e1;
$accent: #c44a2f;
$page-bg: #dedad2;

$font-display: 'DM Serif Display', serif;
$font-body: 'Instrument Sans', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

.splitContainer {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: $page-bg;
}

.darkSide {
  width: 60vw;
  min-height: 100vh;
  background: $black;
  color: $white;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(24px, 5vw, 80px);
}

.lightSide {
  flex: 1;
  min-height: 100vh;
  background: $page-bg;
  position: relative;
  z-index: 1;
  padding: clamp(24px, 5vw, 80px);
}

.splitLine {
  position: fixed;
  left: 60vw;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    $accent 20%,
    $accent 80%,
    transparent
  );
  z-index: 10;
  pointer-events: none;
}

.heroTitle {
  font-family: $font-display;
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
}

.heroTagline {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: $cream;
  max-width: 400px;
  line-height: 1.5;
}

.projectCard {
  background: $white;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: $black;
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }
}

.projectImage {
  position: relative;
  aspect-ratio: 16 / 10;
  background: $cream;
}

.projectInfo {
  padding: 20px;
}

.projectCategory {
  font-family: $font-mono;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $accent;
  margin-bottom: 8px;
}

.projectTitle {
  font-family: $font-display;
  font-size: 1.25rem;
  margin: 0;
}

// Responsive
@media (max-width: 768px) {
  .splitContainer {
    flex-direction: column;
  }

  .darkSide {
    width: 100%;
    min-height: 60vh;
  }

  .lightSide {
    width: 100%;
    min-height: auto;
  }

  .splitLine {
    display: none;
  }
}
```

---

## Component Implementation

### HomepageSplit.tsx (Server)

```typescript
import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageSplitClient from "./HomepageSplitClient";

export default async function HomepageSplit() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageSplitClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
```

### HomepageSplitClient.tsx (Client)

```typescript
"use client";

import { useRef } from "react";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageSplit.module.scss";
import { useSplitAnimation } from "./hooks/useSplitAnimation";
import Image from "next/image";
import Link from "next/link";

interface HomepageSplitClientProps {
  portfolioItems: PortfolioItem[];
}

export default function HomepageSplitClient({ portfolioItems }: HomepageSplitClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const splitLineRef = useRef<HTMLDivElement>(null);

  useSplitAnimation(containerRef, splitLineRef);

  return (
    <main ref={containerRef} className={styles.splitContainer}>
      <div className={styles.splitLine} ref={splitLineRef} />

      <div className={styles.darkSide}>
        <section className={styles.heroSplitSection}>
          <div className={`${styles.heroContent} dark-text`}>
            <h1 className={styles.heroTitle}>
              Intelligent
              <br />
              Project
            </h1>
            <p className={styles.heroTagline}>
              Стратегія зустрічається з візуальною досконалістю.
              Створюємо бренди, що залишаються в пам'яті.
            </p>
          </div>
        </section>

        <section className={styles.manifestoSplitSection}>
          <div className={`${styles.manifestoText} dark-text`}>
            <p>
              Ми не просто створюємо дизайн.
              Ми будуємо візуальні системи, що працюють.
            </p>
          </div>
        </section>
      </div>

      <div className={styles.lightSide}>
        <section className={styles.projectsSplitSection}>
          <h2 className={styles.projectsTitle}>Обрані роботи</h2>
          <div className={styles.projectsGrid}>
            {portfolioItems.map((item) => (
              <Link
                key={item.id}
                href={`/projects/${item.slug}`}
                className={`${styles.projectCard} project-card-split`}
              >
                <div className={styles.projectImage}>
                  {item.main_image && (
                    <Image
                      src={item.main_image}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectCategory}>
                    {item.categories[0]?.name || "Брендинг"}
                  </div>
                  <h3 className={styles.projectTitle}>{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/projects" className={styles.viewAllLink}>
            Всі проєкти →
          </Link>
        </section>
      </div>
    </main>
  );
}
```

---

## Technical Challenges

1. **Clip-path synchronization**: The light side needs to clip content that crosses the split
2. **Mobile adaptation**: Stack vertically, split becomes horizontal divider
3. **Performance**: Heavy use of clip-path can impact performance
4. **Cursor interaction**: Optional cursor-based split angle adjustment

## Estimated Complexity: Medium

---

## Usage

To use this direction, update `src/app/page.tsx`:

```typescript
import HomepageSplit from "./components/HomepageSplit/HomepageSplit";

export default function Home() {
  return <HomepageSplit />;
}
```
