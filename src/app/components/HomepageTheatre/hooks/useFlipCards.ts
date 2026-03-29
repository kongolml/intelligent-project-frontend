"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useFlipCards(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".flip-card");

    gsap.set(cards, {
      rotationY: 90,
      transformOrigin: "center center",
      opacity: 0,
    });

    gsap.to(cards, {
      rotationY: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    const handleMouseEnter = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      gsap.to(card, {
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      gsap.to(card, {
        y: 0,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    cards.forEach((card) => {
      const htmlCard = card as HTMLElement;
      htmlCard.addEventListener("mouseenter", handleMouseEnter);
      htmlCard.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        htmlCard.removeEventListener("mouseenter", handleMouseEnter);
        htmlCard.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [containerRef]);
}
