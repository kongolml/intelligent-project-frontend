import { useRef, useCallback } from "react";
import gsap from "gsap";

interface SpringConfig {
  stiffness?: number;
  damping?: number;
}

export function useSpringSnap(config: SpringConfig = {}) {
  const { stiffness = 100, damping = 10 } = config;
  const tweens = useRef<Map<Element, gsap.core.Tween>>(new Map());

  const snap = useCallback((element: Element) => {
    const existingTween = tweens.current.get(element);
    if (existingTween) {
      existingTween.kill();
    }

    const tween = gsap.to(element, {
      x: 0,
      y: 0,
      duration: 1,
      ease: `elastic.out(${stiffness / 100}, ${damping / 10})`
    });

    tweens.current.set(element, tween);
  }, [stiffness, damping]);

  const snapAll = useCallback((elements: NodeListOf<Element> | Element[]) => {
    elements.forEach(snap);
  }, [snap]);

  return { snap, snapAll };
}
