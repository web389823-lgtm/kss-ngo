import { useEffect } from "react";

/**
 * Lightweight site-wide enhancements (post cursor/particle cleanup):
 * - Scroll reveal for sections / [data-reveal] / .kss-stagger
 * - Animated counters on [data-counter]
 * - Smooth image fade-in + lazy-loading/async decoding on non-hero <img>
 * - Lazy <video> attributes (preload="metadata", playsinline)
 *
 * Removed: custom cursor, magnetic buttons, 3D tilt, parallax, particle effects,
 * mouse/pointermove/RAF cursor loops, page transition overlay.
 */
export default function SiteEnhancements() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -------- Scroll reveal --------
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const scanReveal = () => {
      document.querySelectorAll<HTMLElement>(
        ".reveal-section:not(.is-visible), [data-reveal]:not(.is-visible), .kss-stagger:not(.is-visible)",
      ).forEach((el) => revealIO.observe(el));
      document.querySelectorAll<HTMLElement>("section:not([data-kss-revealed])").forEach((el) => {
        el.dataset.kssRevealed = "1";
        el.classList.add("reveal-section");
        revealIO.observe(el);
      });
    };
    if (!reduced) scanReveal();

    // -------- Counters --------
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        counterIO.unobserve(el);
        const target = parseFloat(el.dataset.counter || "0");
        const suffix = el.dataset.counterSuffix || "";
        const dur = parseInt(el.dataset.counterDuration || "1800", 10);
        if (reduced) { el.textContent = target + suffix; return; }
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => counterIO.observe(el));

    // -------- Image lazy-loading + fade-in --------
    const tagImages = () => {
      document.querySelectorAll<HTMLImageElement>("img:not([data-kss-img])").forEach((img) => {
        img.dataset.kssImg = "1";
        // Add native lazy-loading + async decoding unless explicitly opted out
        if (!img.hasAttribute("loading") && !img.dataset.eager) img.setAttribute("loading", "lazy");
        if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add("kss-loaded");
        } else {
          img.dataset.kssLoading = "1";
          img.addEventListener("load", () => { img.classList.add("kss-loaded"); img.removeAttribute("data-kss-loading"); }, { once: true });
          img.addEventListener("error", () => img.removeAttribute("data-kss-loading"), { once: true });
        }
      });
    };
    tagImages();

    // -------- Video defaults: preload=metadata, playsinline --------
    const tagVideos = () => {
      document.querySelectorAll<HTMLVideoElement>("video:not([data-kss-vid])").forEach((v) => {
        v.dataset.kssVid = "1";
        if (!v.hasAttribute("preload")) v.setAttribute("preload", "metadata");
        if (!v.hasAttribute("playsinline")) v.setAttribute("playsinline", "");
      });
    };
    tagVideos();

    // -------- Pointer-based 3D tilt for [data-tilt] elements --------
    const tiltCleanups: Array<() => void> = [];
    const initTilt = () => {
      if (reduced) return;
      document.querySelectorAll<HTMLElement>("[data-tilt]:not([data-tilt-init])").forEach((el) => {
        el.dataset.tiltInit = "1";
        el.style.transformStyle = "preserve-3d";
        el.style.transition = "transform 300ms cubic-bezier(.2,.8,.2,1)";
        const max = parseFloat(el.dataset.tiltMax || "10");
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(8px)`;
        };
        const onLeave = () => { el.style.transform = ""; };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        tiltCleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });
    };
    initTilt();

    // -------- MutationObserver for new DOM --------
    const mo = new MutationObserver(() => {
      if (!reduced) scanReveal();
      tagImages();
      tagVideos();
      initTilt();
      document.querySelectorAll<HTMLElement>("[data-counter]:not([data-counter-init])").forEach((el) => {
        el.dataset.counterInit = "1"; counterIO.observe(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealIO.disconnect();
      counterIO.disconnect();
      mo.disconnect();
      tiltCleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

