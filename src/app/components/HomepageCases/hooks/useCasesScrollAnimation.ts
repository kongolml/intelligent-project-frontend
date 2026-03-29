"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP ScrollTrigger animations for the Cases slider section.
 * - Each project image scales/fades in on scroll (scrubbed)
 * - Subtle parallax on inner images
 * - Active index tracked via ScrollTrigger onToggle
 */
export function useCasesScrollAnimation(
  containerRef: RefObject<HTMLElement | null>,
  setActiveIndex: (index: number) => void
) {
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Small delay to let DOM paint
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const images = gsap.utils.toArray<HTMLElement>(".cases-project-image");

        images.forEach((image, index) => {
          // Image reveal: scale + opacity + slight Y offset
          gsap.from(image, {
            scale: 0.92,
            opacity: 0,
            y: 60,
            ease: "power2.out",
            scrollTrigger: {
              trigger: image,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.4,
            },
          });

          // Active index tracking
          ScrollTrigger.create({
            trigger: image,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: ({ isActive }) => {
              if (isActive) {
                setActiveIndex(index);
              }
            },
          });
        });

        // Subtle parallax on inner images
        const innerImages = gsap.utils.toArray<HTMLElement>(
          ".cases-project-image-inner"
        );
        innerImages.forEach((inner) => {
          gsap.fromTo(
            inner,
            { y: -20 },
            {
              y: 20,
              ease: "none",
              scrollTrigger: {
                trigger: inner.closest(".cases-project-image") || inner,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      }, containerRef);

      // Store context for cleanup
      (containerRef.current as HTMLElement & { __gsapCtx?: gsap.Context }).__gsapCtx = ctx;
    });

    return () => {
      cancelAnimationFrame(raf);
      const el = containerRef.current as HTMLElement & { __gsapCtx?: gsap.Context } | null;
      if (el?.__gsapCtx) {
        el.__gsapCtx.revert();
      }
    };
  }, [containerRef, setActiveIndex]);
}
