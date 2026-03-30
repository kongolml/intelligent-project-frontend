"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageCurator.module.scss";
import {
  useRevealAnimations,
  useHeroAnimations,
  useHorizontalScroll,
} from "./hooks/useHomepageAnimations";

interface HomepageCuratorClientProps {
  showcases: PortfolioItem[];
}

const CAPABILITIES = [
  { number: "01", name: "Illustration" },
  { number: "02", name: "Packaging" },
  { number: "03", name: "Polygraphy" },
  { number: "04", name: "Web Design" },
  { number: "05", name: "Identity" },
];

export default function HomepageCuratorClient({ showcases }: HomepageCuratorClientProps) {
  useRevealAnimations();
  useHeroAnimations();
  const { scrollRef, scrollPrev, scrollNext } = useHorizontalScroll();

  return (
    <div className={styles.curatorPage}>
      {/* ─── HERO ─── */}
      <section className={`${styles.hero} hero-section`}>
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className="reveal-line">
            <span className={styles.heroLabel}>Design Studio</span>
          </div>
          <h1 className={styles.heroH1}>
            <span className="reveal-line">
              <span>Crafting</span>
            </span>{" "}
            <span className="reveal-line">
              <span className={styles.heroItalic}>Digital</span>
            </span>{" "}
            <span className="reveal-line">
              <span>Narratives</span>
            </span>
          </h1>
          <p className={`${styles.heroTagline} reveal`} style={{ transitionDelay: "0.5s" }}>
            An independent design studio weaving strategy into tactile visual experiences for the
            world&apos;s most discerning brands.
          </p>
          <div className="reveal" style={{ transitionDelay: "0.7s" }}>
            <a href="#works" className={styles.heroScrollLink}>
              View Portfolio
              <span className={styles.heroScrollLine} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO SLIDER ─── */}
      <section className={styles.portfolioSection} id="works">
        <div className={styles.portfolioHeader}>
          <div className={styles.portfolioHeaderLeft}>
            <span className={`${styles.portfolioLabel} reveal`}>Gallery 01</span>
            <h2 className={`${styles.portfolioTitle} reveal`} style={{ transitionDelay: "0.1s" }}>
              Selected Works
            </h2>
          </div>
          <div className={`${styles.portfolioNav} reveal`} style={{ transitionDelay: "0.2s" }}>
            <button
              className={styles.navButton}
              onClick={scrollPrev}
              aria-label="Previous project"
            >
              <span className={styles.navButtonIcon}>←</span>
            </button>
            <button
              className={styles.navButton}
              onClick={scrollNext}
              aria-label="Next project"
            >
              <span className={styles.navButtonIcon}>→</span>
            </button>
          </div>
        </div>

        <div className={styles.sliderContainer} ref={scrollRef}>
          {showcases.map((item) => (
            <Link
              key={item.id}
              href={`/projects/${item.slug}`}
              className={styles.projectCard}
              data-card
            >
              <div className={styles.projectCardImage}>
                {item.main_image && (
                  <Image
                    src={item.main_image}
                    alt={item.title}
                    fill
                    className={styles.projectCardImg}
                    sizes="(max-width: 768px) 85vw, 380px"
                  />
                )}
              </div>
              <div className={styles.projectCardInfo}>
                <h3 className={styles.projectCardTitle}>{item.title}</h3>
                {item.categories.length > 0 && (
                  <p className={styles.projectCardCategory}>
                    {item.categories.map((c) => c.name).join(" / ")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CAPABILITIES ─── */}
      <section className={styles.capabilitiesSection}>
        <div className={styles.capabilitiesInner}>
          <div className={styles.capabilitiesSidebar}>
            <span className={`${styles.capabilitiesLabel} reveal`}>Expertise</span>
            <h2
              className={`${styles.capabilitiesTitle} reveal`}
              style={{ transitionDelay: "0.1s" }}
            >
              Our Core Capabilities
            </h2>
          </div>
          <div className={styles.capabilitiesList}>
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.number}
                className={`${styles.capabilityItem} reveal`}
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className={styles.capabilityLeft}>
                  <span className={styles.capabilityNumber}>{cap.number}</span>
                  <h3 className={styles.capabilityName}>{cap.name}</h3>
                </div>
                <span className={styles.capabilityArrow}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section className={styles.manifestoSection}>
        <p className={`${styles.manifestoText} reveal`}>
          Ми не просто створюємо дизайн. Ми будуємо візуальні системи, що працюють. Кожен
          проєкт — це діалог між стратегією та естетикою.
        </p>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <h2 className={`${styles.ctaHeadline} reveal`}>
          Готові розпочати{" "}
          <span className={styles.ctaHeadlineItalic}>проєкт?</span>
        </h2>
        <div className={`${styles.ctaButtonWrapper} reveal`} style={{ transitionDelay: "0.15s" }}>
          <Link href="/contact" className={styles.ctaButton}>
            Зв&apos;язатись
          </Link>
        </div>
      </section>
    </div>
  );
}
