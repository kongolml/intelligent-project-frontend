"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageCases.module.scss";
import { useHeroEntry } from "./hooks/useHeroEntry";
import { useCasesScrollAnimation } from "./hooks/useCasesScrollAnimation";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";

interface HomepageCasesClientProps {
  portfolioItems: PortfolioItem[];
}

const CAPABILITIES = [
  {
    index: "01",
    title: "Брендинг",
    description: "Стратегія, візуальна ідентичність, позиціонування та наратив бренду",
  },
  {
    index: "02",
    title: "Вебсайти",
    description: "Дизайн та розробка цифрових продуктів, що працюють на результат",
  },
  {
    index: "03",
    title: "Айдентика",
    description: "Візуальні системи, типографіка, кольорові палітри та гайдлайни",
  },
  {
    index: "04",
    title: "Пакування",
    description: "Дизайн упаковки та друкованих матеріалів для фізичних продуктів",
  },
];

export default function HomepageCasesClient({
  portfolioItems,
}: HomepageCasesClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const casesRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const stableSetActiveIndex = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  useHeroEntry(heroRef);
  useCasesScrollAnimation(casesRef, stableSetActiveIndex);
  useRevealOnScroll();

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <main className={styles.page}>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className={`${styles.hero} cases-hero`}>
        <div className={styles.heroBg}>
          <div className={styles.heroGradient} />
          <div className={styles.heroGrid} />
          <div className={styles.heroNoise} />
        </div>

        <div className={styles.heroContent}>
          <div className="reveal-line">
            <span className={styles.heroLabel}>
              Студія брендингу та дизайну
            </span>
          </div>

          <h1 className={`${styles.heroTitle} reveal`}>
            <span className="agency-title-text">|</span>
          </h1>

          <p className={`${styles.heroTagline} reveal`}>
            Стратегія зустрічається з візуальною досконалістю.
            <br />
            Створюємо бренди, що залишаються в пам&apos;яті.
          </p>
        </div>

        <div className={`${styles.heroScrollIndicator} reveal`}>
          <span className={styles.heroScrollLabel}>Скрол</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ===== CASES SLIDER ===== */}
      <section ref={casesRef} className={styles.cases}>
        <div className={styles.casesInner}>
          {/* Left sticky column */}
          <div className={styles.casesLeft}>
            <div className={styles.casesLeftSticky}>
              <span className={`${styles.casesLabel} reveal`}>
                Обрані роботи
              </span>
              <h2 className={`${styles.casesHeading} reveal`}>Cases</h2>
              <p className={`${styles.casesDescription} reveal`}>
                Стратегічний дизайн для брендів,
                <br />
                що прагнуть більшого.
              </p>
            </div>
          </div>

          {/* Center: scrolling project images */}
          <div className={styles.casesCenter}>
            {portfolioItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/projects/${item.slug}`}
                className={`${styles.casesProjectLink} cases-project-image`}
              >
                <div className={styles.casesProjectImageWrap}>
                  {item.main_image ? (
                    <Image
                      src={item.main_image}
                      alt={item.title}
                      fill
                      className={`${styles.casesProjectImg} cases-project-image-inner`}
                      sizes="(max-width: 768px) 90vw, 45vw"
                    />
                  ) : (
                    <div className={styles.casesProjectPlaceholder} />
                  )}
                </div>
                {/* Mobile only: title below image */}
                <div className={styles.casesProjectMobileInfo}>
                  <span className={styles.casesProjectMobileIndex}>
                    {padIndex(index)}
                  </span>
                  <h3 className={styles.casesProjectMobileTitle}>
                    {item.title}
                  </h3>
                  <span className={styles.casesProjectMobileCategory}>
                    {item.categories[0]?.name || "Брендинг"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right sticky column: title list */}
          <div className={styles.casesRight}>
            <div className={styles.casesRightSticky}>
              <nav className={styles.casesTitleList}>
                {portfolioItems.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.slug}`}
                    className={`${styles.casesTitleItem} ${
                      index === activeIndex ? styles.casesTitleActive : ""
                    }`}
                  >
                    <span className={styles.casesTitleIndex}>
                      {padIndex(index)}
                    </span>
                    <span className={styles.casesTitleName}>{item.title}</span>
                  </Link>
                ))}
              </nav>
              <Link href="/projects" className={`${styles.casesViewAll} reveal`}>
                Усі проєкти
                <span className={styles.casesViewAllArrow}>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MANIFESTO ===== */}
      <section className={styles.manifesto}>
        <div className={styles.manifestoInner}>
          <span className={`${styles.manifestoLabel} reveal`}>Маніфест</span>
          <blockquote className={styles.manifestoQuote}>
            <div className="reveal-line">
              <span>Ми не просто створюємо дизайн.</span>
            </div>
            <div className="reveal-line" style={{ transitionDelay: "0.1s" }}>
              <span>Ми будуємо візуальні системи,</span>
            </div>
            <div className="reveal-line" style={{ transitionDelay: "0.2s" }}>
              <span>що працюють на бізнес</span>
            </div>
            <div className="reveal-line" style={{ transitionDelay: "0.3s" }}>
              <span>та залишаються в пам&apos;яті.</span>
            </div>
          </blockquote>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className={styles.capabilities}>
        <div className={styles.capabilitiesInner}>
          <span className={`${styles.capabilitiesLabel} reveal`}>
            Компетенції
          </span>
          <div className={styles.capabilitiesGrid}>
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.index}
                className={`${styles.capabilityCard} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className={styles.capabilityIndex}>{cap.index}</span>
                <h3 className={styles.capabilityTitle}>{cap.title}</h3>
                <p className={styles.capabilityDescription}>
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaContent}>
            <h2 className={`${styles.ctaHeading} reveal`}>Є проєкт?</h2>
            <p className={`${styles.ctaSubtext} reveal`} style={{ transitionDelay: "0.1s" }}>
              Давайте створимо щось разом
            </p>
          </div>
          <a
            href="mailto:hello@intelligent-project.com"
            className={`${styles.ctaLink} reveal`}
            style={{ transitionDelay: "0.2s" }}
          >
            Написати нам
            <span className={styles.ctaArrow}>&rarr;</span>
          </a>
        </div>
      </section>
    </main>
  );
}
