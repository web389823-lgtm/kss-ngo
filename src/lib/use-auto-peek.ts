import { useEffect, useRef } from "react";

/**
 * Mobile/touch-only auto-peek: when a card enters the viewport center,
 * call onPeek(true), then onPeek(false) 2s later. Fires once per card per session.
 * No-op on desktop, on reduced-motion, or after first trigger.
 */
export function useAutoPeek<T extends HTMLElement>(onPeek: (open: boolean) => void) {
  const ref = useRef<T | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onPeek(true);
            window.setTimeout(() => onPeek(false), 2000);
            io.disconnect();
          }
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onPeek]);

  return ref;
}
