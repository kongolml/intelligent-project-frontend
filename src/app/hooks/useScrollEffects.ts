"use client";

import gsap from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect } from "react";

interface UseScrollEffectsProps {
  isMobile: boolean;
  projectsCount: number;
  projectsListRef: React.RefObject<HTMLElement | null>;
  projectNavRef: React.RefObject<HTMLElement | null>;
  projectsDemoRef: React.RefObject<HTMLElement | null>;
  heroRef: React.RefObject<HTMLElement | null>;
  ourServicesRef: React.RefObject<HTMLElement | null>;
}

export default function useScrollEffects({
  isMobile,
  projectsCount,
  projectsListRef,
  projectNavRef,
  projectsDemoRef,
  heroRef,
  ourServicesRef,
}: UseScrollEffectsProps) {
  useEffect(() => {
    // Prevent SSR crash
    if (typeof window === "undefined") return;

    const ScrollMagic = (window as any).ScrollMagic;
    // const gsap = (window as any).gsap;

    if (!ScrollMagic || !gsap) {
      console.warn("ScrollMagic or GSAP not loaded.");
      return;
    }

    if (
      !projectsListRef.current ||
      !projectNavRef.current ||
      !projectsDemoRef.current ||
      !heroRef.current ||
      !ourServicesRef.current
    ) {
      return;
    }

    // gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrambleTextPlugin);
    const controller = new ScrollMagic.Controller();

    // introduction text animation
    // gsap.set(".we-are", { opacity: 1 });
    // let split = SplitText.create(".we-are", { type: "chars" });
    // gsap.from(split.chars, {
    //   y: 20,
    //   autoAlpha: 0,
    //   stagger: 0.05
    // });

    gsap.to(".we-are", {
      scrambleText: {
        text: "Intelligent Project",
        speed: 0.5,
        chars: "Є#Ї+0X_",
        revealDelay: 0.1,
      },
      duration: 1,
    });
    
    // Calculate project slides - same as original logic
    const projectSlidesInCarousel = projectsCount;
    const projectImageInScrollPercentages = 100 / (projectSlidesInCarousel - 1);
    const carouselLengthInSlides = projectSlidesInCarousel - 1;

    // Get projects section padding top
    const projectsSectionPaddingTop = parseInt(
      window.getComputedStyle(projectsDemoRef.current).getPropertyValue("padding-top"),
      10
    );

    // Mobile-specific height calculation
    if (isMobile) {
      const projectsImagesWrpHeight =
        window.innerHeight -
        projectsSectionPaddingTop * 4 -
        projectNavRef.current.offsetHeight;
      if (projectsListRef.current) {
        (projectsListRef.current as HTMLElement).style.height = `${projectsImagesWrpHeight}px`;
      }
    }

    // Set item height - using projectsListRef which is the wrapper (projectsListWrp)
    const itemHeight = projectsListRef.current 
      ? (projectsListRef.current as HTMLElement).offsetHeight 
      : 0;
    
    // Set height for each figure element
    const figures = projectsDemoRef.current.querySelectorAll("figure");
    figures.forEach((figure) => {
      (figure as HTMLElement).style.height = `${itemHeight}px`;
    });

    // Get the projects list container (the element that will be animated)
    // This is the first child div of projectsListWrp (the projectsList element)
    const projectsListContainer = projectsListRef.current?.firstElementChild as HTMLElement;
    
    if (!projectsListContainer) {
      console.warn("Projects list container not found");
      return;
    }

    // Create tween using modern GSAP API (gsap.timeline instead of TimelineMax)
    const projectsListTween = gsap.timeline().add(
      gsap.to(projectsListContainer, {
        y: -itemHeight * carouselLengthInSlides,
        ease: "none",
        duration: 1,
      })
    );

    // Scene setup - matching original logic
    const projectsSlidesSceneSetup = !isMobile
      ? {
          triggerElement: projectsDemoRef.current,
          duration: itemHeight * carouselLengthInSlides,
          triggerHook: 0,
          offset:
            -((window.innerHeight - 
              (projectsDemoRef.current.querySelector(`[class*="projectsWrp"]`) as HTMLElement)?.offsetHeight || 0) / 2) +
            projectsSectionPaddingTop,
        }
      : {
          triggerElement: projectsDemoRef.current,
          duration: projectsListRef.current?.offsetWidth 
            ? projectsListRef.current.offsetWidth * carouselLengthInSlides 
            : 0,
          triggerHook: 0,
          offset:
            -((document.querySelector("header") as HTMLElement)?.offsetHeight || 0) +
            projectsSectionPaddingTop / 2,
        };

    // Handle active portfolio item
    const handleActivePortfolioItem = (event: any) => {
      const progress = Math.floor(event.progress * 100);
      const activeItemActivationPoinDeviation = 1;
      const activeItem = Math.floor(
        progress / (projectImageInScrollPercentages * activeItemActivationPoinDeviation)
      );

      if (activeItem < projectSlidesInCarousel) {
        const slideControls = projectNavRef.current?.querySelectorAll(".slide-controls li");
        slideControls?.forEach((li) => li.classList.remove("active"));
        const activeLi = slideControls?.[activeItem] as HTMLElement;
        if (activeLi) {
          activeLi.classList.add("active");
        }
      }
    };

    // Create main scene
    const projectsSlidesScene = new ScrollMagic.Scene(projectsSlidesSceneSetup)
      .on("progress", (event: any) => {
        handleActivePortfolioItem(event);
      })
      .on("enter leave", function (event: any) {
        const scrollToServicesEl = document.querySelector(".scroll-to-services");
        if (!scrollToServicesEl) return;
        
        if (event.type === "enter") {
          scrollToServicesEl.classList.add("fadeInUp");
          scrollToServicesEl.classList.remove("fadeOutUp");
        } else {
          scrollToServicesEl.classList.remove("fadeInUp");
          scrollToServicesEl.classList.add("fadeOutUp");
        }
      })
      .setTween(projectsListTween)
      .setPin(projectsDemoRef.current.querySelector(`[class*="projectsWrp"]`) as HTMLElement)
      .addTo(controller);

    // Hero intro text animation
    const heroIntoText = document.getElementById("hero-into-text");
    if (heroIntoText && heroRef.current) {
      const introTextTween = gsap.timeline().add(
        gsap.to(heroIntoText, {
          y: heroRef.current.offsetHeight * 0.45,
          autoAlpha: 0,
          ease: "none",
          duration: 1,
        })
      );

      const projectsWrp = projectsDemoRef.current.querySelector(`[class*="projectsWrp"]`) as HTMLElement;
      const projectsWrpHeight = projectsWrp?.offsetHeight || 0;

      const introTextScene = new ScrollMagic.Scene({
        triggerHook: 0,
        duration:
          heroRef.current.offsetHeight -
          (window.innerHeight - projectsWrpHeight) / 2 -
          projectsSectionPaddingTop,
      })
        .setTween(introTextTween)
        .addTo(controller);
    }

    // Project anchor click handler
    const handleProjectAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("real-link")) {
        return;
      }

      e.preventDefault();

      const scrollToItem = (itemNumber: number) => {
        const projectEl = document.getElementById(`project-${itemNumber}`);
        if (!projectEl || !projectsDemoRef.current) return;

        const projectsWrp = projectsDemoRef.current.querySelector(`[class*="projectsWrp"]`) as HTMLElement;
        const projectsWrpHeight = projectsWrp?.offsetHeight || 0;

        const toScrollWithoutTweenTopMovement =
          projectsDemoRef.current.offsetTop -
          (window.innerHeight - projectsWrpHeight) / 2 +
          projectsSectionPaddingTop +
          projectEl.offsetHeight * (itemNumber - 1);

        const toScroll = toScrollWithoutTweenTopMovement;

        // Use ScrollMagic's scrollTo method if available, otherwise use window.scrollTo
        if (controller.scrollTo) {
          controller.scrollTo(toScroll);
        } else {
          window.scrollTo({ top: toScroll, behavior: "smooth" });
        }
      };

      const targetNumber = parseInt(target.dataset.projectNumber || "0", 10);
      if (targetNumber > 0) {
        scrollToItem(targetNumber);
      }

      return false;
    };

    // Attach click handlers
    const projectAnchors = document.querySelectorAll(".project-anchor");
    projectAnchors.forEach((el) => {
      el.addEventListener("click", handleProjectAnchorClick);
    });

    // Scroll to services handler
    const scrollToServicesBtn = document.querySelector(".scroll-to-services");
    const scrollToServices = () => {
      // const servicesEl = document.getElementById("our-services");
      const servicesEl = ourServicesRef.current;
      if (servicesEl) {
        window.scrollTo({ top: servicesEl.offsetTop, behavior: "smooth" });
      }
    };
    scrollToServicesBtn?.addEventListener("click", scrollToServices);

    // Cleanup
    return () => {
      controller.destroy();
      projectAnchors.forEach((el) => {
        el.removeEventListener("click", handleProjectAnchorClick);
      });
      scrollToServicesBtn?.removeEventListener("click", scrollToServices);
    };
  }, [isMobile, projectsCount, projectsListRef, projectNavRef, projectsDemoRef, heroRef, ourServicesRef]);
}
