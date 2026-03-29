"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useSplitAnimation(
  containerRef: RefObject<HTMLElement | null>,
  splitLineRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!containerRef.current || !splitLineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(splitLineRef.current, {
        x: "-60vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-split-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".dark-text", {
        x: -100,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".hero-split-section",
          start: "20% top",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".project-card-split", {
        x: 200,
        opacity: 0,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".projects-split-section",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, splitLineRef]);
}
