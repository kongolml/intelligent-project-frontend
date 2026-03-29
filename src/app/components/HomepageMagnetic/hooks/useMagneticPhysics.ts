import { useEffect, RefObject, useCallback } from "react";
import gsap from "gsap";

interface MagneticConfig {
  strength?: number;
  radius?: number;
  attraction?: boolean;
}

export function useMagneticPhysics(
  containerRef: RefObject<HTMLElement | null>,
  config: MagneticConfig = {}
) {
  const {
    strength = 40,
    radius = 300,
    attraction = false
  } = config;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    const cards = container.querySelectorAll<HTMLElement>(".magnetic-card");
    const isHoveringAny = Array.from(cards).some(card => 
      card.matches(":hover") || card.contains(e.target as Node)
    );

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
      const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;

      const distX = cursorX - cardCenterX;
      const distY = cursorY - cardCenterY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius && !isHoveringAny) {
        const force = Math.pow(1 - distance / radius, 2);
        const direction = attraction ? 1 : -1;
        
        const pushX = (distX / distance) * force * strength * direction;
        const pushY = (distY / distance) * force * strength * direction;

        gsap.to(card, {
          x: pushX,
          y: pushY,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  }, [strength, radius, attraction, containerRef]);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(".magnetic-card");

    cards.forEach((card) => {
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, containerRef]);
}
