import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/donate") || path.startsWith("/admin")) return;
    if (sessionStorage.getItem("kss-exit-shown") === "1") return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setOpen(true);
        sessionStorage.setItem("kss-exit-shown", "1");
        document.removeEventListener("mouseleave", onLeave);
      }
    };
    const t = setTimeout(() => document.addEventListener("mouseleave", onLeave), 4000);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", onLeave); };
  }, [path]);

  if (!open) return null;
  return (
    <div className="kss-exit-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
      <div className="kss-exit-box" onClick={(e) => e.stopPropagation()}>
        <button className="kss-exit-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        <h2 className="gradient-heading kss-exit-title">Before you go...</h2>
        <p className="kss-exit-sub">
          Your ₹500 can provide stationery for a child for an entire year.
          Every rupee of seva counts. 🙏
        </p>
        <div className="kss-exit-actions">
          <Link to="/donate" className="kss-exit-cta" onClick={() => setOpen(false)}>❤️ Donate Now</Link>
          <button className="kss-exit-later" onClick={() => setOpen(false)}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
}
