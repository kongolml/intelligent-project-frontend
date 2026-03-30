"use client";

import { forwardRef, useEffect } from "react";
import gsap from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import styles from "../HomepageV2.module.scss";

interface HeroSectionProps {
  onScrollClick: () => void;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection(
  { onScrollClick },
  ref
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrambleTextPlugin);

    gsap.to(".we-are", {
      scrambleText: {
        text: "Intelligent Project",
        speed: 0.5,
        chars: "ЄЇ?+_\\1",
        revealDelay: 0.1,
      },
      duration: 1.2,
      delay: 0.3,
    });

    const heroElements = document.querySelectorAll(
      ".hero .reveal-line, .hero .reveal"
    );
    heroElements.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 400 + i * 120);
    });
  }, []);

  return (
    <section ref={ref} className={styles.hero}>
      <div className={styles.heroBg}>
        <div className={styles.heroGradient} />
        <div className={styles.heroNoise} />
        <div className={styles.heroGrid} />
      </div>

      <div className={styles.heroContent}>
        <div className="reveal-line">
          <span className={styles.heroLabel}>Студія брендингу та дизайну</span>
        </div>

        <h1 className={`${styles.heroTitle} reveal`} style={{ transitionDelay: "0.15s" }}>
          <span className="we-are">|</span>
        </h1>

        <p className={`${styles.heroTagline} reveal`} style={{ transitionDelay: "0.3s" }}>
          Чистий дизайн. Сильні бренди.
          <br />
          Деталі мають значення.
        </p>
      </div>

      <div className={styles.heroScroll} onClick={onScrollClick}>
        <span>Скрол</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
});

export default HeroSection;
