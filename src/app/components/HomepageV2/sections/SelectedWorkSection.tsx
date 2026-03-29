"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../../types/portfolio.types";
import styles from "../HomepageV2.module.scss";

interface SelectedWorkSectionProps {
  portfolioItems: PortfolioItem[];
}

export default function SelectedWorkSection({ portfolioItems }: SelectedWorkSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const totalItems = portfolioItems.length;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || totalItems === 0) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const itemWidth = carousel.scrollWidth / totalItems;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setCurrentIndex(Math.min(newIndex, totalItems - 1));
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [totalItems]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setIsDragging(true);
    setStartX(e.pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const carousel = carouselRef.current;
    if (!carousel || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const carousel = carouselRef.current;
    if (!carousel || !isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  };

  const scrollToIndex = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const itemWidth = carousel.scrollWidth / totalItems;
    carousel.scrollTo({ left: itemWidth * index, behavior: "smooth" });
  };

  return (
    <section id="selected-work" className={styles.selectedWork}>
      <div className={styles.selectedWorkHeader}>
        <h2 className={`${styles.selectedWorkTitle} reveal`}>Обрані роботи</h2>
        <Link href="/projects" className={`${styles.selectedWorkLink} reveal`} style={{ transitionDelay: "0.1s" }}>
          Усі проєкти
          <span className={styles.arrow}>→</span>
        </Link>
      </div>

      <div className={styles.projectsCarousel}>
        <div
          ref={carouselRef}
          className={styles.projectsCarouselInner}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
          style={{ cursor: isDragging ? "grabbing" : "grab", overflowX: totalItems > 1 ? "auto" : "visible" }}
        >
          {portfolioItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/projects/${item.slug}`}
              className={`${styles.projectCard} reveal`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className={styles.projectImage}>
                {item.main_image && (
                  <Image
                    src={item.main_image}
                    alt={item.title}
                    fill
                    className={styles.projectImageInner}
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                )}
              </div>
              <div className={styles.projectInfo}>
                <div className={styles.projectCategory}>
                  {item.categories.length > 0
                    ? item.categories.map((c) => c.name).join(" / ")
                    : "Брендинг"}
                </div>
                <h3 className={styles.projectTitle}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {totalItems > 1 && (
        <div className={styles.carouselProgress}>
          {portfolioItems.map((_, index) => (
            <button
              key={index}
              className={`${styles.progressDot} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Проєкт ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
