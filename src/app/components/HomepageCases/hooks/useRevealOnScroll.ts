"use client";

import { useEffect } from "react";

/**
 * IntersectionObserver-based reveal animations.
 * - `.reveal` elements: fade-up (opacity 0 + translateY 32px -> visible)
 * - `.reveal-line` elements: mask-slide (inner span translateY 110% -> 0)
 *
 * Each element reveals once. CSS transitions are defined in the SCSS module.
 * Skips elements inside `.cases-hero` — those are handled by useHeroEntry.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealed = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealed.has(entry.target)) {
            revealed.add(entry.target);
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.05,
      }
    );

    const revealElements = document.querySelectorAll(".reveal, .reveal-line");
    revealElements.forEach((el) => {
      if (el.closest(".cases-hero")) return;
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}
