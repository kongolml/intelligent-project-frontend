"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../../types/portfolio.types";
import styles from "../HomepageMagnetic.module.scss";

interface MagneticCardProps {
  project: PortfolioItem;
  index: number;
}

export default function MagneticCard({ project, index }: MagneticCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.08,
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25)",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`${styles.magneticCard} magnetic-card`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.cardImage}>
        {project.main_image && (
          <Image
            src={project.main_image}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <div className={styles.cardOverlay}>
          <span className={styles.viewProject}>Переглянути</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <span className={styles.cardCategory}>
          {project.categories[0]?.name || "Брендинг"}
        </span>
        <h3 className={styles.cardTitle}>{project.title}</h3>
      </div>
    </Link>
  );
}
