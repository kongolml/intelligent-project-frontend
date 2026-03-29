"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

interface UseTypewriterOptions {
  typeSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export function useTypewriter(
  elementRef: RefObject<HTMLElement | null>,
  messages: string[],
  options: UseTypewriterOptions = {}
) {
  const { typeSpeed = 1, pauseDuration = 2000, loop = true } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let isCancelled = false;

    const typeMessage = (index: number) => {
      if (isCancelled) return;

      gsap.to(element, {
        duration: typeSpeed,
        scrambleText: {
          text: messages[index],
          chars: "lowerCase",
          speed: 0.5,
          revealDelay: 0.1,
        },
        ease: "none",
        onComplete: () => {
          if (isCancelled) return;
          if (loop || index < messages.length - 1) {
            setTimeout(() => {
              const nextIndex = (index + 1) % messages.length;
              typeMessage(nextIndex);
            }, pauseDuration);
          }
        },
      });
    };

    typeMessage(0);

    return () => {
      isCancelled = true;
      gsap.killTweensOf(element);
    };
  }, [messages, typeSpeed, pauseDuration, loop, elementRef]);
}
