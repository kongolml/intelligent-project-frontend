"use client";

import Link from "next/link";
import styles from "../HomepageV2.module.scss";

export default function CTABand() {
  return (
    <section className={styles.ctaBand}>
      <h2 className={`${styles.ctaText} reveal`}>
        Створімо щось виняткове разом.
      </h2>
      <Link
        href="mailto:hello@intelligentproject.com"
        className={`${styles.ctaButton} reveal`}
        style={{ transitionDelay: "0.15s" }}
      >
        Почати розмову
        <span className={styles.ctaArrow}>→</span>
      </Link>
    </section>
  );
}
