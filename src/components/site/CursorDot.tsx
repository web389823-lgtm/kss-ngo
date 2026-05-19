import { useEffect, useRef, useState } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      if (!dotRef.current) return;
      dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      const t = e.target as HTMLElement | null;
      const isHover = !!t?.closest("a, button, img, [data-cursor-hover]");
      setHover(isHover);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: hover ? 28 : 12,
        height: hover ? 28 : 12,
        borderRadius: "9999px",
        background: hover ? "rgba(232,84,10,0.25)" : "#E8540A",
        border: hover ? "1px solid #E8540A" : "none",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "multiply",
        transition: "width 180ms ease, height 180ms ease, background 180ms ease",
        willChange: "transform",
      }}
    />
  );
}
