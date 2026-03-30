"use client";

import styles from "../HomepageV2.module.scss";

const capabilities = [
  {
    label: "Брендинг",
    title: "Бренд-ідентичність",
    description:
      "Логотипи, брендбуки та візуальні системи, що позиціонують бренди для преміальних ринків.",
  },
  {
    label: "Упаковка",
    title: "Дизайн упаковки",
    description:
      "Продукт-дизайн, що вирізняється на полиці та розповідає історію в руках споживача.",
  },
  {
    label: "Веб",
    title: "Цифровий досвід",
    description:
      "Вебсайти та інтерфейси, що перетворюють відвідувачів на клієнтів через дизайн.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section className={styles.capabilities}>
      <div className={styles.capabilitiesInner}>
        {capabilities.map((cap, index) => (
          <div
            key={cap.label}
            className={`${styles.capabilityItem} reveal`}
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            <div className={styles.capabilityLabel}>{cap.label}</div>
            <h3 className={styles.capabilityTitle}>{cap.title}</h3>
            <p className={styles.capabilityDesc}>{cap.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
