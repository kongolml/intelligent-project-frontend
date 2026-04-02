"use client";

import { useEffect } from "react";
import { ANIMATION } from "@/app/constants/animation";

interface UseHeroEntryOptions {
  selector?: string;
  staggerDelay?: number;
  staggerInterval?: number;
}

export function useHeroEntry(options: UseHeroEntryOptions = {}) {
  const {
    selector = ".hero-section .reveal-line, .hero-section .reveal",
    staggerDelay = ANIMATION.HERO_STAGGER_DELAY,
    staggerInterval = ANIMATION.HERO_STAGGER_INTERVAL,
  } = options;

  useEffect(() => {
    const heroElements = document.querySelectorAll(selector);
    const timeoutIds: NodeJS.Timeout[] = [];

    heroElements.forEach((el, i) => {
      timeoutIds.push(setTimeout(() => el.classList.add("visible"), staggerDelay + i * staggerInterval));
    });

    return () => timeoutIds.forEach(clearTimeout);
  }, [selector, staggerDelay, staggerInterval]);
}
