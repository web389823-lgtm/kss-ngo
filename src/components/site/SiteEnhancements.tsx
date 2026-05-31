import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Site-wide visual enhancements:
 * - Custom cursor (dot + ring) on desktop
 * - Magnetic CTA buttons
 * - 3D card tilt on .kss-card / [data-tilt]
 * - Scroll reveal for .reveal-section / [data-reveal] / .kss-stagger
 * - Animated counters on [data-counter]
 * - Smooth image fade-in
 * - Hero parallax via [data-parallax="0.3"]
 * - Page transition overlay on route change
 */
export default function SiteEnhancements() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Page transition overlay
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const overlay = document.createElement("div");
    overlay.className = "kss-page-overlay is-clearing";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add("is-done"));
    });
    const t = setTimeout(() => overlay.remove(), 600);
    return () => { clearTimeout(t); overlay.remove(); };
  }, [path]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // -------- Custom cursor (desktop only) --------
    let cursorCleanup: (() => void) | null = null;
    if (fine && !reduced) {
      const dot = document.createElement("div");
      dot.className = "kss-cursor-dot";
      const ring = document.createElement("div");
      ring.className = "kss-cursor-ring";
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      document.body.classList.add("kss-cursor-on");

      let mx = -100, my = -100, rx = -100, ry = -100;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
        const t = e.target as HTMLElement | null;
        const hover = !!t?.closest("a, button, [role='button'], input, textarea, select, .kss-card, [data-cursor-hover]");
        document.body.classList.toggle("kss-cursor-hover", hover);
      };
      let raf = 0;
      const tick = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      window.addEventListener("mousemove", onMove, { passive: true });
      cursorCleanup = () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
        dot.remove(); ring.remove();
        document.body.classList.remove("kss-cursor-on", "kss-cursor-hover");
      };
    }

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const scanReveal = () => {
      document.querySelectorAll<HTMLElement>(
        ".reveal-section:not(.is-visible), [data-reveal]:not(.is-visible), .kss-stagger:not(.is-visible)"
      ).forEach((el) => revealIO.observe(el));
      // auto-tag <section> elements once for site-wide reveal
      document.querySelectorAll<HTMLElement>("section:not([data-kss-revealed])").forEach((el) => {
        el.dataset.kssRevealed = "1";
        el.classList.add("reveal-section");
        revealIO.observe(el);
      });
    };
    if (reduced) {
      // skip — let everything show
    } else {
      scanReveal();
    }

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

    // -------- 3D tilt (desktop only) --------
    let tiltCleanup: (() => void) | null = null;
    if (fine && !reduced && !isMobile) {
      const tiltCards = new Set<HTMLElement>();
      const attachTilt = (card: HTMLElement) => {
        if (tiltCards.has(card)) return;
        tiltCards.add(card);
        card.classList.add("kss-tilt");
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
          const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 6;
          card.classList.remove("is-leaving");
          card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
        };
        const onLeave = () => {
          card.classList.add("is-leaving");
          card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        (card as any)._tiltCleanup = () => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        };
      };
      const scanTilt = () => {
        document.querySelectorAll<HTMLElement>(".kss-card, [data-tilt]").forEach(attachTilt);
      };
      scanTilt();
      tiltCleanup = () => {
        tiltCards.forEach((c) => (c as any)._tiltCleanup?.());
        tiltCards.clear();
      };
      // expose scan for MutationObserver below
      (window as any).__kssScanTilt = scanTilt;
    }

    // -------- Magnetic buttons (desktop only) --------
    let magneticCleanup: (() => void) | null = null;
    if (fine && !reduced && !isMobile) {
      const magnets: HTMLElement[] = [];
      const scan = () => {
        document.querySelectorAll<HTMLElement>(
          "[data-magnetic], a[href='/donate'], a[href*='/donate'], button[type='submit']"
        ).forEach((el) => {
          if ((el as any)._magnetic) return;
          (el as any)._magnetic = true;
          magnets.push(el);
        });
      };
      scan();
      const onMove = (e: MouseEvent) => {
        magnets.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const r = 70;
          if (dist < r) {
            const s = 1 - dist / r;
            el.style.transform = `translate(${dx * s * 0.35}px, ${dy * s * 0.35}px)`;
            el.style.transition = "transform 80ms linear";
          } else if (el.style.transform) {
            el.style.transform = "translate(0,0)";
            el.style.transition = "transform 400ms var(--transition-spring)";
          }
        });
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      (window as any).__kssScanMagnetic = scan;
      magneticCleanup = () => window.removeEventListener("mousemove", onMove);
    }

    // -------- Image fade-in --------
    const tagImages = () => {
      document.querySelectorAll<HTMLImageElement>("img:not([data-kss-img])").forEach((img) => {
        img.dataset.kssImg = "1";
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

    // -------- Hero parallax --------
    let parallaxRaf = 0;
    const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]");
    const onScroll = () => {
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const mult = parseFloat(el.dataset.parallax || "0.3");
          el.style.transform = `translate3d(0, ${y * mult}px, 0)`;
        });
        parallaxRaf = 0;
      });
    };
    if (!reduced && parallaxEls.length) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // -------- MutationObserver: scan when new DOM is added --------
    const mo = new MutationObserver(() => {
      scanReveal();
      tagImages();
      (window as any).__kssScanTilt?.();
      (window as any).__kssScanMagnetic?.();
      document.querySelectorAll<HTMLElement>("[data-counter]:not([data-counter-init])").forEach((el) => {
        el.dataset.counterInit = "1"; counterIO.observe(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cursorCleanup?.();
      tiltCleanup?.();
      magneticCleanup?.();
      revealIO.disconnect();
      counterIO.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
    };
  }, []);

  return null;
}
