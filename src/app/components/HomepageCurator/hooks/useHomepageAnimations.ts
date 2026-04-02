"use client";

import { useRef, useCallback } from "react";
import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import { useHeroEntry } from "@/app/hooks/useHeroEntry";
import { SCROLL } from "@/app/constants/animation";

export function useRevealAnimations() {
  useRevealOnScroll();
}

export function useHeroAnimations() {
  useHeroEntry();
}

export function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.querySelector("[data-card]")?.clientWidth ?? SCROLL.CARD_WIDTH_FALLBACK;
    const scrollAmount = cardWidth + SCROLL.HORIZONTAL_GAP;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const scrollPrev = useCallback(() => scroll("prev"), [scroll]);
  const scrollNext = useCallback(() => scroll("next"), [scroll]);

  return { scrollRef, scrollPrev, scrollNext };
}
