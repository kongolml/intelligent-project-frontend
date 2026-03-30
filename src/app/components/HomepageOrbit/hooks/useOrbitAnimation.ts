"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrbitConfig {
  radius?: number;
  rotationSpeed?: number;
}

export function useOrbitAnimation(
  containerRef: RefObject<HTMLElement | null>,
  projectsCount: number,
  config: OrbitConfig = {}
) {
  const {
    radius = typeof window !== "undefined" ? Math.min(window.innerWidth, 800) * 0.35 : 280,
    rotationSpeed = 0.5
  } = config;

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const projects = gsap.utils.toArray<HTMLElement>(".orbiting-project");
    let currentRotation = 0;

    const initialAngle = (i: number) => (i / projects.length) * Math.PI * 2 - Math.PI / 2;

    projects.forEach((project, i) => {
      const angle = initialAngle(i);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.5;

      gsap.set(project, {
        x: x,
        y: y,
        attr: { "data-angle": angle.toString() }
      });
    });

    gsap.from(projects, {
      scale: 0,
      opacity: 0,
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.1
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        currentRotation += velocity * 0.0001 * rotationSpeed;

        projects.forEach((project, i) => {
          const baseAngle = initialAngle(i);
          const angle = baseAngle + currentRotation;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;
          const scale = 0.8 + (Math.sin(angle) + 1) * 0.2;
          const zIndex = Math.round((Math.sin(angle) + 1) * 10);

          gsap.to(project, {
            x,
            y,
            scale,
            zIndex,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      }
    });

    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1.3,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        duration: 0.3
      });
      gsap.to(projects.filter(p => p !== target), {
        opacity: 0.5,
        duration: 0.3
      });
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, {
        scale: 1,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        duration: 0.3
      });
      gsap.to(projects, {
        opacity: 1,
        duration: 0.3
      });
    };

    projects.forEach(project => {
      project.addEventListener("mouseenter", handleMouseEnter);
      project.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      scrollTrigger.kill();
      projects.forEach(project => {
        project.removeEventListener("mouseenter", handleMouseEnter);
        project.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [radius, rotationSpeed, projectsCount]);
}
