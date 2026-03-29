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

        {portfolioItems.map((item) => (
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
