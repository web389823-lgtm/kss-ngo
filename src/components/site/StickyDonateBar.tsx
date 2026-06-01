import { useEffect, useState } from "react";
import { useRouterState, Link } from "@tanstack/react-router";

export default function StickyDonateBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem("kss-donate-bar-dismissed") === "1");
  }, []);

  useEffect(() => {
    if (path !== "/" || dismissed) { setVisible(false); return; }
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      const nearBottom = h.scrollHeight - (h.scrollTop + h.clientHeight) < 200;
      setVisible(pct > 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path, dismissed]);

  if (path !== "/" || dismissed) return null;

  return (
    <div className={`kss-sticky-donate-bar ${visible ? "is-visible" : ""}`} role="region" aria-label="Donate prompt">
      <span className="kss-sticky-donate-text">
        🙏 Support KSS — Your donation transforms lives across Bengaluru
      </span>
      <div className="kss-sticky-donate-actions">
        <Link to="/donate" className="kss-sticky-donate-btn">Donate Now →</Link>
        <button
          type="button"
          aria-label="Dismiss"
          className="kss-sticky-donate-close"
          onClick={() => {
            sessionStorage.setItem("kss-donate-bar-dismissed", "1");
            setDismissed(true);
          }}
        >✕</button>
      </div>
    </div>
  );
}
