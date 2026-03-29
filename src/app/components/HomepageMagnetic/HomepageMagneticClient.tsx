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
      <section className={styles.heroMagnetic}>
        <h1 className={styles.heroTitle}>
          Intelligent
          <br />
          Project
        </h1>
        <p className={styles.heroSubtitle}>Студія брендингу та дизайну</p>
      </section>

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

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Створімо щось виняткове разом.</h2>
        <Link href="mailto:hello@intelligentproject.com" className={styles.ctaButton}>
          Почати розмову →
        </Link>
      </section>
    </main>
  );
}
