"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * IntersectionObserver-based reveal animations.
 * Elements with class "reveal" get "visible" added when they enter viewport.
 * Elements with class "reveal-line" also get "visible" for line-reveal effect.
 */
export function useRevealAnimations() {
  useEffect(() => {
    const revealed = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealed.has(entry.target)) return;
          revealed.add(entry.target);
          entry.target.classList.add("visible");
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.05,
      }
    );

    document.querySelectorAll(".reveal, .reveal-line").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * Staggered hero entry animation.
 * Finds hero elements with "reveal-line" or "reveal" classes
 * and adds "visible" with staggered delays.
 */
export function useHeroAnimations() {
  useEffect(() => {
    const heroElements = document.querySelectorAll(
      ".hero-section .reveal-line, .hero-section .reveal"
    );
    const timeoutIds: NodeJS.Timeout[] = [];
    heroElements.forEach((el, i) => {
      timeoutIds.push(setTimeout(() => el.classList.add("visible"), 200 + i * 150));
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, []);
}

/**
 * Horizontal scroll slider ref for the portfolio section.
 * Returns a ref to attach to the scroll container.
 */
export function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.querySelector("[data-card]")?.clientWidth ?? 700;
    const gap = 48; // match CSS gap
    const scrollAmount = cardWidth + gap;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const scrollPrev = useCallback(() => scroll("prev"), [scroll]);
  const scrollNext = useCallback(() => scroll("next"), [scroll]);

  return { scrollRef, scrollPrev, scrollNext };
}
