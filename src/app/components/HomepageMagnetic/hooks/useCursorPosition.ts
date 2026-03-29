import { useEffect, useRef, useState, RefObject } from "react";

interface CursorPosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useCursorPosition(
  containerRef: RefObject<HTMLElement | null>,
  throttleMs: number = 16
): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5
  });
  const lastUpdate = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate.current < throttleMs) return;
      lastUpdate.current = now;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({
        x,
        y,
        normalizedX: x / rect.width,
        normalizedY: y / rect.height
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [throttleMs, containerRef]);

  return position;
}
