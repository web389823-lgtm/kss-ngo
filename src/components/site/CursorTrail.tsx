import { useEffect, useRef } from "react";

const COUNT = 12;

export default function CursorTrail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = ref.current;
    if (!container) return;
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < COUNT; i++) {
      const d = document.createElement("div");
      d.className = "kss-trail-dot";
      container.appendChild(d);
      dots.push(d);
    }
    const trail: { x: number; y: number }[] = [];
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      trail.unshift({ x: e.clientX, y: e.clientY });
      if (trail.length > COUNT) trail.pop();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dots.forEach((dot, i) => {
          const p = trail[i];
          if (!p) { dot.style.opacity = "0"; return; }
          const s = 1 - i * 0.06;
          dot.style.transform = `translate(${p.x - 3}px, ${p.y - 3}px) scale(${s})`;
          dot.style.opacity = String(1 - i / COUNT);
        });
      });
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.remove());
    };
  }, []);

  return <div ref={ref} className="kss-trail-container" aria-hidden />;
}
