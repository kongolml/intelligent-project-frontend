# Homepage Direction C: "Vertical Theatre"

## Concept

Each scroll is a scene change. Full-viewport sections with dramatic entrance animations. Text that disintegrates and reforms, projects that flip in with 3D perspective, and theatrical reveals that feel like stage curtains opening.

## Visual Reference

```
SCENE 1 - HERO:
┌─────────────────────────────────────────────┐
│                                             │
│        [Letters scatter into particles]     │
│                                             │
│              I N T E L L I G E N T          │
│              (each letter animated)         │
│                                             │
│        [Letters reassemble as scroll ↓]     │
│                                             │
└─────────────────────────────────────────────┘
          ↓ SCROLL TRANSITION (particles)

SCENE 2 - MANIFESTO:
┌─────────────────────────────────────────────┐
│                                             │
│   "Design is not decoration."               │
│    ↑ types letter by letter                 │
│                                             │
│   [Backspaces, types new text]              │
│                                             │
│   "It's strategic intelligence."             │
│                                             │
└─────────────────────────────────────────────┘
          ↓ SCROLL TRANSITION (cards flip in)

SCENE 3 - PROJECTS:
┌─────────────────────────────────────────────┐
│                                             │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│   │ flip in │  │ flip in │  │ flip in │   │
│   │   3D    │  │   3D    │  │   3D    │   │
│   └─────────┘  └─────────┘  └─────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## GSAP Animation Breakdown

| Scene | Animation | GSAP Technique |
|-------|-----------|----------------|
| Hero entrance | Letters fade in staggered | `gsap.from` with stagger |
| Hero scroll | Letters scatter into particles | `gsap.to` with random x/y |
| Hero exit | Particles reform into new text | Timeline with reverse |
| Manifesto | Text types, backspaces, types | ScrambleTextPlugin |
| Projects enter | Cards flip in with 3D rotation | `rotationY` with `transformPerspective` |
| Project hover | Card lifts with shadow | `y`, `boxShadow` |
| Capabilities | Lines draw themselves | SVG `stroke-dashoffset` |
| CTA | Section slides up | `y` from 100vh |

---

## Component Structure

```
src/app/components/HomepageTheatre/
├── HomepageTheatre.tsx
├── HomepageTheatreClient.tsx
├── HomepageTheatre.module.scss
├── components/
│   ├── ParticleText.tsx            # Text that disintegrates
│   ├── TypewriterText.tsx          # Types/backspaces effect
│   ├── FlipCard.tsx                # 3D flip-in card
│   ├── DrawLine.tsx                # SVG line animation
│   └── SceneTransition.tsx         # Between scenes
├── sections/
│   ├── HeroTheatre.tsx             # Scene 1: Particle text
│   ├── ManifestoTheatre.tsx        # Scene 2: Typewriter
│   ├── ProjectsTheatre.tsx          # Scene 3: Flip cards
│   ├── CapabilitiesTheatre.tsx     # Scene 4: Draw lines
│   └── CTATheatre.tsx              # Scene 5: Slide up
└── hooks/
    ├── useParticleText.ts          # Disintegration logic
    ├── useTypewriter.ts            # Type/erase effect
    └── useSceneAnimations.ts       # ScrollTrigger orchestration
```

---

## Key GSAP Code Patterns

### useParticleText.ts

```typescript
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useParticleText(
  containerRef: RefObject<HTMLElement>,
  text: string
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Create letter elements
    const letters = text.split("").map((char, i) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      container.appendChild(span);
      return span;
    });

    // Entrance animation - letters fly in
    gsap.from(letters, {
      opacity: 0,
      y: () => gsap.utils.random(-100, 100),
      x: () => gsap.utils.random(-50, 50),
      rotation: () => gsap.utils.random(-45, 45),
      scale: 0.5,
      duration: 1,
      ease: "power3.out",
      stagger: {
        each: 0.03,
        from: "random"
      }
    });

    // Scroll-triggered scatter
    const scatterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    scatterTimeline.to(letters, {
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      opacity: 0,
      scale: 0.3,
      ease: "power2.in",
      stagger: {
        each: 0.01,
        from: "random"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      letters.forEach(l => l.remove());
    };
  }, [text]);
}
```

### useTypewriter.ts

```typescript
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

export function useTypewriter(
  elementRef: React.RefObject<HTMLElement>,
  messages: string[],
  options: {
    typeSpeed?: number;
    pauseDuration?: number;
    loop?: boolean;
  } = {}
) {
  const { typeSpeed = 1, pauseDuration = 2000, loop = true } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let animationFrame: number;

    const typeMessage = (index: number) => {
      gsap.to(element, {
        duration: typeSpeed,
        scrambleText: {
          text: messages[index],
          chars: "lowerCase",
          speed: 0.5,
          revealDelay: 0.1
        },
        ease: "none",
        onComplete: () => {
          if (loop || index < messages.length - 1) {
            setTimeout(() => {
              const nextIndex = (index + 1) % messages.length;
              setCurrentIndex(nextIndex);
              typeMessage(nextIndex);
            }, pauseDuration);
          }
        }
      });
    };

    typeMessage(0);

    return () => {
      gsap.killTweensOf(element);
    };
  }, [messages, typeSpeed, pauseDuration, loop]);

  return currentIndex;
}
```

### useSceneAnimations.ts

```typescript
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSceneAnimations(
  scenesRef: RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!scenesRef.current) return;

    const scenes = gsap.utils.toArray<HTMLElement>(".scene");
    
    scenes.forEach((scene, index) => {
      // Pin each scene
      ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: false
      });

      // Animate elements within scene
      const revealElements = scene.querySelectorAll(".reveal-scene");
      if (revealElements.length > 0) {
        gsap.from(revealElements, {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scene,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
```

### useFlipCards.ts

```typescript
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useFlipCards(
  containerRef: RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".flip-card");

    // Set initial state
    gsap.set(cards, {
      rotationY: 90,
      transformOrigin: "center center",
      opacity: 0
    });

    // Animate on scroll
    gsap.to(cards, {
      rotationY: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse"
      }
    });

    // Hover effects
    cards.forEach((card) => {
      const htmlCard = card as HTMLElement;
      
      htmlCard.addEventListener("mouseenter", () => {
        gsap.to(htmlCard, {
          y: -10,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      htmlCard.addEventListener("mouseleave", () => {
        gsap.to(htmlCard, {
          y: 0,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
```

---

## SCSS Structure

```scss
// HomepageTheatre.module.scss

$black: #0a0a0a;
$white: #f5f2ed;
$cream: #ece8e1;
$accent: #c44a2f;
$forest: #2d4a3e;
$page-bg: #dedad2;

$font-display: 'DM Serif Display', serif;
$font-body: 'Instrument Sans', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Scene wrapper
.theatreContainer {
  background: $page-bg;
  overflow-x: hidden;
}

// === SCENE 1: HERO ===
.heroScene {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.heroBackground {
  position: absolute;
  inset: 0;
  background: $black;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      rgba($forest, 0.3) 0%,
      transparent 70%
    );
  }
}

.particleTextContainer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90vw;
  
  :global(.letter) {
    font-family: $font-display;
    font-size: clamp(3rem, 12vw, 10rem);
    color: $white;
    line-height: 0.9;
    letter-spacing: -0.02em;
    will-change: transform, opacity;
  }
}

.heroSubtitle {
  position: relative;
  z-index: 10;
  font-family: $font-mono;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: $cream;
  margin-top: 32px;
  opacity: 0.8;
}

.scrollIndicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: $cream;
  font-family: $font-mono;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.scrollLine {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, $cream, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(0.6); opacity: 0.5; }
}


// === SCENE 2: MANIFESTO ===
.manifestoScene {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 8vh, 80px);
  background: $white;
}

.manifestoContent {
  max-width: 800px;
  text-align: center;
}

.manifestoLabel {
  font-family: $font-mono;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: $accent;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &::before,
  &::after {
    content: '';
    width: 32px;
    height: 1px;
    background: $accent;
  }
}

.manifestoText {
  font-family: $font-display;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: $black;
  min-height: 3em;
}


// === SCENE 3: PROJECTS ===
.projectsScene {
  min-height: 100vh;
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
  background: $page-bg;
}

.projectsHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.projectsTitle {
  font-family: $font-display;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin: 0;
}

.projectsLink {
  font-family: $font-mono;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $black;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: $accent;
  }
}

.projectsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  perspective: 1000px;
}

.flipCard {
  background: $white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  text-decoration: none;
  color: $black;
  display: block;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.flipCardImage {
  position: relative;
  aspect-ratio: 4 / 3;
  background: $cream;
  overflow: hidden;
}

.flipCardInfo {
  padding: 20px;
}

.flipCardCategory {
  font-family: $font-mono;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $accent;
  margin-bottom: 8px;
}

.flipCardTitle {
  font-family: $font-display;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.3;
}


// === SCENE 4: CAPABILITIES ===
.capabilitiesScene {
  padding: clamp(60px, 10vh, 120px) clamp(24px, 5vw, 80px);
  background: $white;
}

.capabilitiesInner {
  max-width: 900px;
  margin: 0 auto;
}

.capabilityItem {
  padding: 40px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  
  &:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
}

.capabilityIcon {
  margin-bottom: 16px;
  
  svg {
    width: 32px;
    height: 32px;
    stroke: $accent;
    stroke-width: 1.5;
    fill: none;
  }
}

.capabilityTitle {
  font-family: $font-display;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}

.capabilityDesc {
  font-size: 1rem;
  line-height: 1.6;
  color: #3a3a38;
  max-width: 600px;
}


// === SCENE 5: CTA ===
.ctaScene {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 8vh, 80px);
  background: $forest;
  color: $white;
}

.ctaContent {
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

  .arrow {
    transition: transform 0.3s ease;
  }

  &:hover .arrow {
    transform: translateX(8px);
  }
}


// === RESPONSIVE ===
@media (max-width: 768px) {
  .projectsGrid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .projectsHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .heroSubtitle {
    text-align: center;
    padding: 0 20px;
  }
}
```

---

## Component Implementation

### HomepageTheatre.tsx (Server)

```typescript
import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageTheatreClient from "./HomepageTheatreClient";

export default async function HomepageTheatre() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageTheatreClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
```

### HomepageTheatreClient.tsx (Client)

```typescript
"use client";

import { useRef } from "react";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageTheatre.module.scss";
import { useParticleText } from "./hooks/useParticleText";
import { useTypewriter } from "./hooks/useTypewriter";
import { useFlipCards } from "./hooks/useFlipCards";
import { useSceneAnimations } from "./hooks/useSceneAnimations";
import Image from "next/image";
import Link from "next/link";

interface HomepageTheatreClientProps {
  portfolioItems: PortfolioItem[];
}

export default function HomepageTheatreClient({ portfolioItems }: HomepageTheatreClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const manifestoTextRef = useRef<HTMLParagraphElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useParticleText(heroTextRef, "Intelligent Project");
  useTypewriter(manifestoTextRef, [
    "Design is not decoration.",
    "It's strategic intelligence.",
    "Translated into visual form."
  ]);
  useFlipCards(projectsRef);
  useSceneAnimations(containerRef);

  const scrollToProjects = () => {
    const projectsScene = document.getElementById("projects-scene");
    if (projectsScene) {
      projectsScene.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main ref={containerRef} className={styles.theatreContainer}>
      {/* SCENE 1: HERO */}
      <section className={`${styles.heroScene} scene`}>
        <div className={styles.heroBackground} />
        <div ref={heroTextRef} className={styles.particleTextContainer} />
        <p className={`${styles.heroSubtitle} reveal-scene`}>
          Студія брендингу та дизайну
        </p>
        <div className={styles.scrollIndicator} onClick={scrollToProjects}>
          <span>Скрольте</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* SCENE 2: MANIFESTO */}
      <section className={`${styles.manifestoScene} scene`}>
        <div className={styles.manifestoContent}>
          <div className={`${styles.manifestoLabel} reveal-scene`}>Філософія</div>
          <p ref={manifestoTextRef} className={styles.manifestoText} />
        </div>
      </section>

      {/* SCENE 3: PROJECTS */}
      <section id="projects-scene" className={`${styles.projectsScene} scene`}>
        <div className={styles.projectsHeader}>
          <h2 className={`${styles.projectsTitle} reveal-scene`}>Обрані роботи</h2>
          <Link href="/projects" className={`${styles.projectsLink} reveal-scene`}>
            Всі проєкти →
          </Link>
        </div>

        <div ref={projectsRef} className={styles.projectsGrid}>
          {portfolioItems.map((item) => (
            <Link
              key={item.id}
              href={`/projects/${item.slug}`}
              className={`${styles.flipCard} flip-card`}
            >
              <div className={styles.flipCardImage}>
                {item.main_image && (
                  <Image
                    src={item.main_image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className={styles.flipCardInfo}>
                <div className={styles.flipCardCategory}>
                  {item.categories[0]?.name || "Брендинг"}
                </div>
                <h3 className={styles.flipCardTitle}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SCENE 4: CAPABILITIES */}
      <section className={`${styles.capabilitiesScene} scene`}>
        <div className={styles.capabilitiesInner}>
          {[
            { title: "Бренд-ідентичність", desc: "Логотипи, системи та візуальні мови для преміальних ринків." },
            { title: "Дизайн упаковки", desc: "Продукти, що виділяються на полиці та розповідають історії." },
            { title: "Цифровий досвід", desc: "Вебсайти та інтерфейси, що перетворюють відвідувачів на клієнтів." }
          ].map((cap, i) => (
            <div key={i} className={`${styles.capabilityItem} reveal-scene`}>
              <h3 className={styles.capabilityTitle}>{cap.title}</h3>
              <p className={styles.capabilityDesc}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCENE 5: CTA */}
      <section className={`${styles.ctaScene} scene`}>
        <div className={styles.ctaContent}>
          <h2 className={`${styles.ctaTitle} reveal-scene`}>
            Створімо щось виняткове разом.
          </h2>
          <Link href="mailto:hello@intelligentproject.com" className={`${styles.ctaButton} reveal-scene`}>
            Почати розмову
            <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## Technical Challenges

1. **Particle system performance**: Need to limit particle count on mobile
2. **3D flip card accessibility**: Ensure focus states work correctly
3. **Timing coordination**: Multiple animations need to feel synchronized
4. **Reduced motion**: Provide static fallback for all animations

## Estimated Complexity: Medium-High

---

## Usage

To use this direction, update `src/app/page.tsx`:

```typescript
import HomepageTheatre from "./components/HomepageTheatre/HomepageTheatre";

export default function Home() {
  return <HomepageTheatre />;
}
```
