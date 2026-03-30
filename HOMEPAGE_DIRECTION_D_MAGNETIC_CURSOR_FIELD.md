# Homepage Direction D: "Magnetic Cursor Field"

## Concept

Project cards exist in a magnetic field. Cursor position creates attraction/repulsion. Cards have physics-like behavior - they push away or pull toward the cursor, then smoothly snap back to position when the cursor leaves.

## Visual Reference

```
CURSOR IN CENTER:
┌─────────────────────────────────────────────┐
│                                             │
│   [Card]      [Card]      [Card]            │
│      ←────────●─────────→                    │
│   (pushed)   cursor    (pushed)             │
│                                             │
│   [Card]      [Card]      [Card]            │
│      ←────────          ──────→              │
│                                             │
└─────────────────────────────────────────────┘

CURSOR MOVES RIGHT:
┌─────────────────────────────────────────────┐
│                                             │
│   [Card]←    [Card]←    [Card]←←            │
│                          ●→                 │
│   (less pushed) (more pushed)               │
│                                             │
└─────────────────────────────────────────────┘

CURSOR LEAVES:
┌─────────────────────────────────────────────┐
│                                             │
│   [Card]     [Card]     [Card]              │
│                                             │
│   ←── snap back with spring physics ──→     │
│                                             │
│   [Card]     [Card]     [Card]              │
│                                             │
└─────────────────────────────────────────────┘
```

## GSAP Animation Breakdown

| Interaction | Animation | Physics |
|-------------|-----------|---------|
| Cursor enters field | Cards slowly attract/repel | Inertia plugin |
| Cursor moves | Cards follow with delay | Spring physics |
| Cursor near card | Card lifts and scales | ease: "elastic" |
| Cursor leaves | Cards snap back | Inertia + spring |
| Hover on card | Card stops moving, highlights | Pauses field |
| Click card | Card expands to full viewport | Timeline |

---

## Component Structure

```
src/app/components/HomepageMagnetic/
├── HomepageMagnetic.tsx
├── HomepageMagneticClient.tsx
├── HomepageMagnetic.module.scss
├── components/
│   ├── MagneticField.tsx          # Container with cursor tracking
│   ├── MagneticCard.tsx           # Individual physics-enabled card
│   ├── FieldBackground.tsx        # Optional: visual field lines
│   └── CardExpanded.tsx           # Click-to-expand view
├── sections/
│   ├── HeroMagnetic.tsx          # Intro with magnetic text
│   ├── ProjectsField.tsx         # The magnetic card field
│   ├── ManifestoStatic.tsx       # Normal section below
│   └── CTAStatic.tsx
└── hooks/
    ├── useMagneticPhysics.ts     # GSAP Inertia + custom physics
    ├── useCursorPosition.ts      # Throttled cursor tracking
    └── useSpringSnap.ts          # Spring-back animation
```

---

## Key GSAP Code Patterns

### useMagneticPhysics.ts

```typescript
import { useEffect, RefObject, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MagneticConfig {
  strength?: number;
  radius?: number;
  attraction?: boolean;
}

export function useMagneticPhysics(
  containerRef: RefObject<HTMLElement>,
  config: MagneticConfig = {}
) {
  const {
    strength = 40,
    radius = 300,
    attraction = false
  } = config;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Check if cursor is inside container
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    const cards = container.querySelectorAll<HTMLElement>(".magnetic-card");
    const isHoveringAny = Array.from(cards).some(card => 
      card.matches(":hover") || card.contains(e.target as Node)
    );

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
      const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;

      const distX = cursorX - cardCenterX;
      const distY = cursorY - cardCenterY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius && !isHoveringAny) {
        // Calculate force (inverse square law, clamped)
        const force = Math.pow(1 - distance / radius, 2);
        const direction = attraction ? 1 : -1;
        
        const pushX = (distX / distance) * force * strength * direction;
        const pushY = (distY / distance) * force * strength * direction;

        gsap.to(card, {
          x: pushX,
          y: pushY,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  }, [strength, radius, attraction]);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(".magnetic-card");

    cards.forEach((card) => {
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);
}
```

### MagneticCard.tsx

```typescript
"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../../types/portfolio.types";
import styles from "../HomepageMagnetic.module.scss";

interface MagneticCardProps {
  project: PortfolioItem;
  index: number;
}

export default function MagneticCard({ project, index }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.08,
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25)",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`${styles.magneticCard} magnetic-card`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.cardImage}>
        {project.main_image && (
          <Image
            src={project.main_image}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <div className={styles.cardOverlay}>
          <span className={styles.viewProject}>Переглянути</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <span className={styles.cardCategory}>
          {project.categories[0]?.name || "Брендинг"}
        </span>
        <h3 className={styles.cardTitle}>{project.title}</h3>
      </div>
    </Link>
  );
}
```

### useCursorPosition.ts

```typescript
import { useEffect, useRef, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useCursorPosition(
  containerRef: React.RefObject<HTMLElement>,
  throttleMs: number = 16
): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5
  });
  const lastUpdate = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate.current < throttleMs) return;
      lastUpdate.current = now;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({
        x,
        y,
        normalizedX: x / rect.width,
        normalizedY: y / rect.height
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [throttleMs]);

  return position;
}
```

### useSpringSnap.ts

```typescript
import { useRef, useCallback } from "react";
import gsap from "gsap";

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export function useSpringSnap(config: SpringConfig = {}) {
  const { stiffness = 100, damping = 10, mass = 1 } = config;
  const tweens = useRef<Map<Element, gsap.core.Tween>>(new Map());

  const snap = useCallback((element: Element) => {
    const existingTween = tweens.current.get(element);
    if (existingTween) {
      existingTween.kill();
    }

    const tween = gsap.to(element, {
      x: 0,
      y: 0,
      duration: 1,
      ease: `elastic.out(${stiffness / 100}, ${damping / 10})`
    });

    tweens.current.set(element, tween);
  }, [stiffness, damping]);

  const snapAll = useCallback((elements: NodeListOf<Element> | Element[]) => {
    elements.forEach(snap);
  }, [snap]);

  return { snap, snapAll };
}
```

### FieldBackground.tsx (Optional Visualization)

```typescript
"use client";

import { useEffect, useRef } from "react";
import styles from "../HomepageMagnetic.module.scss";

interface FieldBackgroundProps {
  cursorPosition: { x: number; y: number };
}

export default function FieldBackground({ cursorPosition }: FieldBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={svgRef}
      className={styles.fieldBackground}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(196, 74, 47, 0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle
        cx={cursorPosition.normalizedX * 100}
        cy={cursorPosition.normalizedY * 100}
        r="20"
        fill="url(#fieldGradient)"
        className={styles.fieldCircle}
      />
    </svg>
  );
}
```

---

## SCSS Structure

```scss
// HomepageMagnetic.module.scss

$black: #0a0a0a;
$white: #f5f2ed;
$cream: #ece8e1;
$accent: #c44a2f;
$forest: #2d4a3e;
$page-bg: #dedad2;

$font-display: 'DM Serif Display', serif;
$font-body: 'Instrument Sans', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// === MAIN CONTAINER ===
.magneticContainer {
  min-height: 100vh;
  background: $page-bg;
  overflow-x: hidden;
}


// === HERO SECTION ===
.heroMagnetic {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: $black;
}

.heroTitle {
  font-family: $font-display;
  font-size: clamp(3rem, 12vw, 10rem);
  color: $white;
  text-align: center;
  line-height: 0.9;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
}

.heroSubtitle {
  font-family: $font-mono;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: $cream;
  opacity: 0.7;
}


// === MAGNETIC FIELD ===
.magneticField {
  position: relative;
  min-height: 100vh;
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
  background: $page-bg;
  overflow: hidden;
}

.fieldHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.fieldTitle {
  font-family: $font-display;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin: 0;
}

.fieldHint {
  font-family: $font-mono;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7a7a76;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '↗';
    font-size: 1rem;
  }
}

.fieldGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// === MAGNETIC CARD ===
.magneticCard {
  position: relative;
  background: $white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  text-decoration: none;
  color: $black;
  display: block;
  will-change: transform;
  transition: box-shadow 0.3s ease;

  &:hover {
    z-index: 10 !important;
  }
}

.cardImage {
  position: relative;
  aspect-ratio: 4 / 3;
  background: $cream;
  overflow: hidden;
}

.cardOverlay {
  position: absolute;
  inset: 0;
  background: rgba($black, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  .magneticCard:hover & {
    opacity: 1;
  }
}

.viewProject {
  font-family: $font-mono;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $white;
  padding: 12px 24px;
  border: 1px solid $white;
  border-radius: 4px;
}

.cardInfo {
  padding: 20px;
}

.cardCategory {
  font-family: $font-mono;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $accent;
  margin-bottom: 8px;
  display: block;
}

.cardTitle {
  font-family: $font-display;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.3;
}


// === FIELD BACKGROUND (optional visualization) ===
.fieldBackground {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  z-index: 0;
}

.fieldCircle {
  transition: cx 0.1s ease-out, cy 0.1s ease-out;
}


// === BELOW FOLD SECTIONS ===
.manifestoSection {
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
  background: $white;
}

.manifestoInner {
  max-width: 800px;
  margin: 0 auto;
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

.ctaSection {
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
  background: $forest;
  color: $white;
  text-align: center;
}

.ctaTitle {
  font-family: $font-display;
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 32px;
}

.ctaButton {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: $font-mono;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $white;
  text-decoration: none;
  padding: 16px 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: $white;
  }
}


// === RESPONSIVE ===
@media (max-width: 768px) {
  .magneticField {
    padding: 40px 20px;
  }

  .fieldHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .fieldHint {
    display: none;
  }

  // Disable magnetic effect on mobile
  .magneticCard {
    transform: none !important;
  }
}
```

---

## Component Implementation

### HomepageMagnetic.tsx (Server)

```typescript
import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageMagneticClient from "./HomepageMagneticClient";

export default async function HomepageMagnetic() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageMagneticClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
```

### HomepageMagneticClient.tsx (Client)

```typescript
"use client";

import { useRef } from "react";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageMagnetic.module.scss";
import { useMagneticPhysics } from "./hooks/useMagneticPhysics";
import { useCursorPosition } from "./hooks/useCursorPosition";
import MagneticCard from "./components/MagneticCard";
import FieldBackground from "./components/FieldBackground";
import Link from "next/link";

interface HomepageMagneticClientProps {
  portfolioItems: PortfolioItem[];
}

export default function HomepageMagneticClient({ portfolioItems }: HomepageMagneticClientProps) {
  const fieldRef = useRef<HTMLElement>(null);
  const cursorPosition = useCursorPosition(fieldRef);

  useMagneticPhysics(fieldRef, {
    strength: 35,
    radius: 250,
    attraction: false
  });

  return (
    <main className={styles.magneticContainer}>
      {/* Hero */}
      <section className={styles.heroMagnetic}>
        <h1 className={styles.heroTitle}>
          Intelligent
          <br />
          Project
        </h1>
        <p className={styles.heroSubtitle}>Студія брендингу та дизайну</p>
      </section>

      {/* Magnetic Field */}
      <section ref={fieldRef} className={styles.magneticField}>
        <FieldBackground cursorPosition={cursorPosition} />

        <div className={styles.fieldHeader}>
          <h2 className={styles.fieldTitle}>Обрані роботи</h2>
          <span className={styles.fieldHint}>Наведіть курсор</span>
        </div>

        <div className={styles.fieldGrid}>
          {portfolioItems.map((item, index) => (
            <MagneticCard key={item.id} project={item} index={index} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/projects" className={styles.ctaButton}>
            Всі проєкти →
          </Link>
        </div>
      </section>

      {/* Manifesto */}
      <section className={styles.manifestoSection}>
        <div className={styles.manifestoInner}>
          <h2 className={styles.manifestoTitle}>
            Дизайн — це не прикраса. Це стратегічна думка.
          </h2>
          <p className={styles.manifestoText}>
            Ми створюємо бренди, які не просто виглядають добре — вони працюють.
            Кожне рішення базується на стратегії, кожна деталь має значення.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Створімо щось виняткове разом.</h2>
        <Link href="mailto:hello@intelligentproject.com" className={styles.ctaButton}>
          Почати розмову →
        </Link>
      </section>
    </main>
  );
}
```

---

## Technical Challenges

1. **Mobile/touch support**: Touch doesn't have "cursor leave" - need different interaction model
2. **Performance**: Many cards + physics = potential lag. Need to throttle updates.
3. **Card selection**: When user clicks, card needs to "escape" the magnetic field
4. **Accessibility**: Keyboard navigation should work normally, bypassing magnetic effect
5. **GSAP InertiaPlugin**: This is a paid GSAP plugin - custom spring physics used instead

## Alternative for Mobile

For mobile, consider replacing magnetic effect with:
1. Standard horizontal scroll carousel
2. Touch-drag physics
3. Static grid with tap-to-expand

```typescript
// Mobile detection
const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

// Conditionally apply magnetic effect
useEffect(() => {
  if (isMobile) return;
  // Apply magnetic physics
}, [isMobile]);
```

## Estimated Complexity: High

---

## Usage

To use this direction, update `src/app/page.tsx`:

```typescript
import HomepageMagnetic from "./components/HomepageMagnetic/HomepageMagnetic";

export default function Home() {
  return <HomepageMagnetic />;
}
```
