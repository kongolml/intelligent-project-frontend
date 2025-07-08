"use client";

import { useEffect } from "react";

// import { gsap } from "gsap";
// import  "scrollmagic";
// import "scrollmagic-plugin-gsap";
// import "../lib/scrollmagic-gsap"; // Ensure this is imported to monkey-patch ScrollMagic

interface UseScrollEffectsProps {
  isMobile: boolean;
  projectsCount: number;
  projectsListRef: React.RefObject<HTMLElement | null>;
  projectNavRef: React.RefObject<HTMLElement | null>;
  projectsDemoRef: React.RefObject<HTMLElement | null>;
  heroRef: React.RefObject<HTMLElement | null>;
}

export default function useScrollEffects({
  isMobile,
  projectsCount,
  projectsListRef,
  projectNavRef,
  projectsDemoRef,
  heroRef,
}: UseScrollEffectsProps) {
  useEffect(() => {
    // if (
    //   typeof window === "undefined" ||
    //   typeof document === "undefined" ||
    //   typeof ScrollMagic === "undefined"
    // ) {
    //   return;
    // }

    if (
      !projectsListRef.current ||
      !projectNavRef.current ||
      !projectsDemoRef.current ||
      !heroRef.current
    ) {
      return;
    }

    // ✅ Prevent SSR crash
    if (typeof window === "undefined") return;

    const ScrollMagic = (window as any).ScrollMagic;
    const gsap = (window as any).gsap;
    const TimelineMax = (window as any).TimelineMax;

    if (!ScrollMagic || !gsap) {
      console.warn("ScrollMagic or GSAP not loaded.");
      return;
    }

    const controller = new ScrollMagic.Controller();
    const carouselLength = projectsCount - 1;
    const scrollPercentPerSlide = 100 / carouselLength;

    const projectsSectionPaddingTop = parseInt(
      window.getComputedStyle(projectsDemoRef.current).getPropertyValue("padding-top"),
      10
    );

    if (isMobile) {
      const height =
        window.innerHeight -
        projectsSectionPaddingTop * 4 -
        projectNavRef.current.offsetHeight;
      projectsListRef.current.style.height = `${height}px`;
    }

    const itemHeight = projectsListRef.current.offsetHeight;
    projectsListRef.current.querySelectorAll("li").forEach((el) => {
      (el as HTMLElement).style.height = `${itemHeight}px`;
    });

    const listEl = projectsListRef.current.querySelector(".projects-list");
    if (!listEl) return;

    const projectsListTween = gsap.to(listEl, {
      y: -itemHeight * carouselLength,
      ease: "none",
      duration: 1,
    });

    const offset = !isMobile
      ? -(window.innerHeight - projectNavRef.current.offsetHeight) / 2 + projectsSectionPaddingTop
      : -((document.querySelector("header") as HTMLElement)?.offsetHeight || 0) +
        projectsSectionPaddingTop / 2;

    const mainScene = new ScrollMagic.Scene({
      triggerElement: projectsDemoRef.current,
      duration: itemHeight * carouselLength,
      triggerHook: 0,
      offset,
    })
      .on("progress", (event: ScrollMagic.Event) => {
        const progress = Math.floor(event.progress! * 100);
        const activeItem = Math.floor(progress / scrollPercentPerSlide);

        const navItems = projectNavRef.current!.querySelectorAll("li");
        navItems.forEach((li, i) => {
          li.classList.toggle("active", i === activeItem);
        });
      })
      .on("enter leave", (event: ScrollMagic.Event) => {
        const el = document.querySelector(".scroll-to-services");
        if (!el) return;
        if (event.type === "enter") {
          el.classList.add("fadeInUp");
          el.classList.remove("fadeOutUp");
        } else {
          el.classList.remove("fadeInUp");
          el.classList.add("fadeOutUp");
        }
      })
      .setTween(projectsListTween);

    const pinTarget = projectsDemoRef.current.querySelector(".projects-wrp");
    if (pinTarget) {
      mainScene.setPin(pinTarget);
    }

    mainScene.addTo(controller);

    const heroText = document.getElementById("hero-into-text");
    if (heroText) {
      const introTween = gsap.to(heroText, {
        y: heroRef.current.offsetHeight * 0.45,
        autoAlpha: 0,
        ease: "none",
        duration: 1,
      });

      new ScrollMagic.Scene({
        triggerHook: 0,
        duration:
          heroRef.current.offsetHeight -
          (window.innerHeight - projectNavRef.current.offsetHeight) / 2 -
          projectsSectionPaddingTop,
      })
        .setTween(introTween)
        .addTo(controller);
    }

    const handleProjectAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("real-link")) return;

      e.preventDefault();
      const projectNum = parseInt(target.dataset.projectNumber || "0", 10);
      const projectEl = document.getElementById(`project-${projectNum}`);
      if (!projectEl) return;

      const scrollTo =
        projectsDemoRef.current!.offsetTop +
        projectEl.offsetHeight * (projectNum - 1) +
        projectsSectionPaddingTop -
        (window.innerHeight - projectNavRef.current!.offsetHeight) / 2;

      window.scrollTo({ top: scrollTo, behavior: "smooth" });
    };

    const projectAnchors = document.querySelectorAll(".project-anchor");
    projectAnchors.forEach((el) => el.addEventListener("click", handleProjectAnchorClick));

    const scrollToServicesBtn = document.querySelector(".scroll-to-services");
    const scrollToServices = () => {
      const servicesEl = document.getElementById("our-services");
      if (servicesEl) {
        window.scrollTo({ top: servicesEl.offsetTop, behavior: "smooth" });
      }
    };
    scrollToServicesBtn?.addEventListener("click", scrollToServices);

    return () => {
      controller.destroy();
      projectAnchors.forEach((el) =>
        el.removeEventListener("click", handleProjectAnchorClick)
      );
      scrollToServicesBtn?.removeEventListener("click", scrollToServices);
    };
  }, [isMobile, projectsCount, projectsListRef, projectNavRef, projectsDemoRef, heroRef]);
}
