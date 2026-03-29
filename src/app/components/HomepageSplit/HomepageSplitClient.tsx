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
        <section className={`${styles.heroSplitSection} hero-split-section`}>
          <div className={`${styles.heroContent} dark-text`}>
            <h1 className={styles.heroTitle}>
              Intelligent
              <br />
              Project
            </h1>
            <p className={styles.heroTagline}>
              Стратегія зустрічається з візуальною досконалістю.
              Створюємо бренди, що залишаються в пам&apos;яті.
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
        <section className={`${styles.projectsSplitSection} projects-split-section`}>
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
