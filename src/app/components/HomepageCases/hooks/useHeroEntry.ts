"use client";

import { useEffect, RefObject, useCallback } from "react";
import gsap from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

/**
 * Hero entry animations:
 * 1. ScrambleText reveal for the agency title
 * 2. Staggered reveal of hero elements (.reveal-line, .reveal inside .cases-hero)
 * 3. Scroll-linked corner rounding + scale-down of the hero section
 */
export function useHeroEntry(heroRef: RefObject<HTMLElement | null>) {
  const handleScroll = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const heroHeight = hero.offsetHeight;
    if (heroHeight === 0) return;

    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / (heroHeight * 0.4), 0), 1);

    const maxRadius = window.innerWidth < 768 ? 36 : 60;
    const radius = progress * maxRadius;
    const scale = 1 - progress * 0.03;

    hero.style.borderRadius = `0 0 ${radius}px ${radius}px`;
    hero.style.transform = `scale(${scale})`;
  }, [heroRef]);

  useEffect(() => {
    if (typeof window === "undefined" || !heroRef.current) return;

    // ScrambleText for agency title
    gsap.to(".agency-title-text", {
      scrambleText: {
        text: "Intelligent Project",
        speed: 0.5,
        chars: "ЄЇ?+_\\1",
        revealDelay: 0.1,
      },
      duration: 1.2,
      delay: 0.3,
    });

    // Staggered reveal of hero elements
    const heroElements = document.querySelectorAll(
      ".cases-hero .reveal-line, .cases-hero .reveal"
    );
    heroElements.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 300 + i * 150);
    });

    // Scroll-linked rounding
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [heroRef, handleScroll]);
}
