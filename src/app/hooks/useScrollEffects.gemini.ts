// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";

// import { gsap } from "gsap";
// import  "scrollmagic";
// import "scrollmagic-plugin-gsap";
// import "../lib/scrollmagic-gsap"; // Ensure this is imported to monkey-patch ScrollMagic

interface UseScrollEffectsProps {
            heroRef: React.RefObject<HTMLElement | null>;
            heroTextRef: React.RefObject<HTMLDivElement | null>;
            projectsDemoRef: React.RefObject<HTMLElement | null>;
            projectsWrapperRef: React.RefObject<HTMLDivElement | null>;
            projectsListRef: React.RefObject<HTMLDivElement | null>;
            // slideControlsRef: React.RefObject<HTMLUListElement | null>;
            scrollToServicesRef: React.RefObject<HTMLDivElement | null>;
            projectsCount: number;
        }

export const useScrollEffects = ({
            heroRef,
            heroTextRef,
            projectsDemoRef,
            projectsWrapperRef,
            projectsListRef,
            // slideControlsRef,
            scrollToServicesRef,
            projectsCount
        }: UseScrollEffectsProps) => {
            // We store the controller in a ref to persist it across renders without causing re-renders.
            const controllerRef = useRef(null);

            useEffect(() => {
                // Ensure GSAP and ScrollMagic are loaded (they are included in the HTML)
                // @ts-ignore
                if (typeof (window as any).gsap === 'undefined' || typeof (window as any).ScrollMagic === 'undefined') {
                    console.error("GSAP or ScrollMagic is not loaded!");
                    return;
                }
                
                // Ensure all required DOM elements are mounted and available
                const allRefsAvailable = [
                    heroRef, heroTextRef, projectsDemoRef, projectsWrapperRef,
                    projectsListRef, /*slideControlsRef,*/ scrollToServicesRef
                ].every(ref => ref.current);

                if (!allRefsAvailable || projectsCount === 0) {
                    return;
                }
                
                // Initialize the main controller for all animations
                const controller = new (window as any).ScrollMagic.Controller();
                controllerRef.current = controller;

                const projectsSectionPaddingTop = parseInt(window.getComputedStyle(projectsDemoRef.current).getPropertyValue('padding-top'), 10);
                const itemHeight = projectsWrapperRef.current.offsetHeight;
                const carouselLengthInSlides = projectsCount - 1;

                // --- 1. Pinned Project Carousel Scene ---
                const projectsListTween = (window as any).gsap.to(projectsListRef.current, {
                    y: -itemHeight * carouselLengthInSlides,
                    ease: "none"
                });

                const projectsWrpOuterHeight = projectsWrapperRef.current.offsetHeight;
                const sceneOffset = -((window.innerHeight - projectsWrpOuterHeight) / 2) + projectsSectionPaddingTop;

                const projectsSlidesScene = new (window as any).ScrollMagic.Scene({
                    triggerElement: projectsDemoRef.current,
                    duration: itemHeight * carouselLengthInSlides,
                    triggerHook: 0,
                    offset: sceneOffset
                })
                .setPin(projectsWrapperRef.current)
                .setTween(projectsListTween)
                .on('progress', (event) => {
                    // Update active slide indicator on scroll
                    const progress = event.progress;
                    const activeItem = Math.min(carouselLengthInSlides, Math.floor(progress * projectsCount));
                    
                    // if (slideControlsRef.current) {
                    //     const listItems = slideControlsRef.current.children;
                    //     for (let i = 0; i < listItems.length; i++) {
                    //          listItems[i].classList.toggle('active', i === activeItem);
                    //     }
                    // }
                })
                .on('enter leave', (event) => {
                    // Show/hide the "scroll to next section" button
                    if (event.type === "enter") {
                        scrollToServicesRef.current.classList.add('fadeInUp');
                        scrollToServicesRef.current.classList.remove('fadeOutUp');
                    } else {
                        scrollToServicesRef.current.classList.remove('fadeInUp');
                        scrollToServicesRef.current.classList.add('fadeOutUp');
                    }
                })
                .addTo(controller);


                // --- 2. Hero Intro Text Fade-out Scene ---
                const introTextTween = (window as any).gsap.to(heroTextRef.current, {
                    y: heroRef.current.offsetHeight * 0.45,
                    autoAlpha: 0,
                    ease: "none"
                });

                const introTextSceneDuration = heroRef.current.offsetHeight - ((window.innerHeight - projectsWrpOuterHeight) / 2) - projectsSectionPaddingTop;
                
                new (window as any).ScrollMagic.Scene({
                    triggerElement: heroRef.current,
                    triggerHook: 0,
                    duration: introTextSceneDuration
                })
                .setTween(introTextTween)
                .addTo(controller);

                // --- Cleanup function ---
                // This is crucial to prevent memory leaks when the component unmounts.
                return () => {
                    console.log("Destroying ScrollMagic controller");
                    controller.destroy(true);
                    controllerRef.current = null;
                };

            }, [
                // Dependencies for the effect. It will re-run if any of these change.
                heroRef, heroTextRef, projectsDemoRef, projectsWrapperRef, 
                projectsListRef, /*slideControlsRef,*/ scrollToServicesRef, projectsCount
            ]);

            // --- Function exposed by the hook to allow parent components to trigger actions ---
            const scrollToProject = (itemNumber) => {
                if (!controllerRef.current || !projectsDemoRef.current || !projectsWrapperRef.current) return;

                const projectsSectionPaddingTop = parseInt(window.getComputedStyle(projectsDemoRef.current).getPropertyValue('padding-top'), 10);
                const itemHeight = projectsWrapperRef.current.offsetHeight;
                
                // This calculation is the key to correctly scrolling to a pinned element's section.
                // It combines the trigger element's top position with the scene's offset and the distance into the timeline.
                const sceneOffset = -((window.innerHeight - projectsWrapperRef.current.offsetHeight) / 2) + projectsSectionPaddingTop;
                const toScroll = projectsDemoRef.current.offsetTop + sceneOffset + (itemHeight * (itemNumber - 1));

                controllerRef.current.scrollTo(toScroll);
            };
            
            const scrollToServices = () => {
                const servicesSection = document.getElementById("our-services");
                if(servicesSection) {
                    window.scrollTo({
                        top: servicesSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            };

            return { scrollToProject, scrollToServices };
        };