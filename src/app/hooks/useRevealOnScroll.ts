"use client";

import { useEffect, useRef } from "react";

interface UseRevealOnScrollOptions {
  rootMargin?: string;
  threshold?: number;
  selector?: string;
}

export function useRevealOnScroll(options: UseRevealOnScrollOptions = {}) {
  const { rootMargin = "0px 0px -80px 0px", threshold = 0.05, selector = ".reveal, .reveal-line" } = options;
  const revealed = useRef(new Set<Element>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealed.current.has(entry.target)) return;
          revealed.current.add(entry.target);
          entry.target.classList.add("visible");
        });
      },
      { rootMargin, threshold }
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootMargin, threshold, selector]);
}
