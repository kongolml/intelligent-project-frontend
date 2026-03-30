"use client";

import styles from "../HomepageMagnetic.module.scss";

interface FieldBackgroundProps {
  cursorPosition: { x: number; y: number; normalizedX: number; normalizedY: number };
}

export default function FieldBackground({ cursorPosition }: FieldBackgroundProps) {
  return (
    <svg
      className={styles.fieldBackground}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(196, 74, 47, 0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle
        cx={cursorPosition.normalizedX * 100}
        cy={cursorPosition.normalizedY * 100}
        r="20"
        fill="url(#fieldGradient)"
        className={styles.fieldCircle}
      />
    </svg>
  );
}
