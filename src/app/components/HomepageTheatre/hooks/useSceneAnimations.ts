"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSceneAnimations(scenesRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!scenesRef.current) return;

    const scenes = gsap.utils.toArray<HTMLElement>(".scene");

    scenes.forEach((scene) => {
      ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        markers: false,
      });

      const revealElements = scene.querySelectorAll(".reveal-scene");
      if (revealElements.length > 0) {
        gsap.from(revealElements, {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scene,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [scenesRef]);
}
