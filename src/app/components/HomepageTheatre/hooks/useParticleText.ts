"use client";

import { useEffect, RefObject, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useParticleText(
  containerRef: RefObject<HTMLElement | null>,
  text: string
) {
  const cleanup = useCallback(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const letters = text.split("").map((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      container.appendChild(span);
      return span;
    });

    gsap.from(letters, {
      opacity: 0,
      y: () => gsap.utils.random(-100, 100),
      x: () => gsap.utils.random(-50, 50),
      rotation: () => gsap.utils.random(-45, 45),
      scale: 0.5,
      duration: 1,
      ease: "power3.out",
      stagger: {
        each: 0.03,
        from: "random",
      },
    });

    const scatterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    scatterTimeline.to(letters, {
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      opacity: 0,
      scale: 0.3,
      ease: "power2.in",
      stagger: {
        each: 0.01,
        from: "random",
      },
    });

    return () => {
      cleanup();
    };
  }, [text, containerRef, cleanup]);
}
