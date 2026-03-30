"use client";

import styles from "../HomepageV2.module.scss";

export default function ManifestoSection() {
  return (
    <section className={styles.manifesto}>
      <div className={styles.manifestoInner}>
        <div className={`${styles.manifestoLabel} reveal`}>Філософія</div>

        <div className={`${styles.manifestoText} reveal`} style={{ transitionDelay: "0.1s" }}>
          <p>
            Дизайн — це не прикраса.
            <br />
            Це <span className={styles.accent}>стратегічна думка</span>, переведена у візуальну форму.
          </p>
          <p className={styles.light}>
            Кожне рішення має сенс.
            <br />
            Кожна деталь заробляє своє місце.
          </p>
        </div>
      </div>
    </section>
  );
}
