import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export default function FloatingContactButton() {
  const [shown, setShown] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Hide on admin and login pages
  if (path.startsWith("/admin")) return null;

  const onClick = () => {
    if (path === "/") {
      const el = document.getElementById("get-in-touch");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      nav({ to: "/", hash: "get-in-touch" });
      setTimeout(() => {
        const el = document.getElementById("get-in-touch");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Get in touch"
        className="kss-floating-cta"
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: shown ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(60px)",
          opacity: shown ? 1 : 0,
          zIndex: 999,
          background: "#E8540A",
          color: "#fff",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          padding: "16px 10px",
          border: "none",
          borderRadius: "8px 0 0 8px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "1px",
          cursor: "pointer",
          boxShadow: "-4px 0 20px rgba(232,84,10,0.3)",
          transition: "transform 250ms ease, opacity 400ms ease, box-shadow 250ms ease",
        }}
      >
        <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>GET IN TOUCH</span>
      </button>
      <style>{`
        .kss-floating-cta:hover {
          transform: translateY(-50%) translateX(-4px) !important;
          box-shadow: -8px 0 30px rgba(232,84,10,0.5) !important;
        }
        @keyframes kssCtaPulse {
          0%, 100% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-50%) scale(1.04); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .kss-floating-cta { animation: kssCtaPulse 4s ease-in-out infinite; }
          .kss-floating-cta:hover { animation: none; }
        }
        @media (max-width: 640px) {
          .kss-floating-cta {
            top: auto !important;
            bottom: 30% !important;
            transform: translateX(0) !important;
            font-size: 10px !important;
            padding: 10px 7px !important;
            animation: none !important;
          }
          .kss-floating-cta:hover { transform: translateX(-4px) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kss-floating-cta { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
