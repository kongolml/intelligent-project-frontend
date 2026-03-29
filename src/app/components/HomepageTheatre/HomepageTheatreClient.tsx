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

      <section className={`${styles.manifestoScene} scene`}>
        <div className={styles.manifestoContent}>
          <div className={`${styles.manifestoLabel} reveal-scene`}>Філософія</div>
          <p ref={manifestoTextRef} className={styles.manifestoText} />
        </div>
      </section>

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
