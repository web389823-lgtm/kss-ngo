import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

export default function ShareButton() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Only on detail pages: program/$slug, projects/$slug, blog/$slug
  const show = /^\/(programs|projects|blog)\/[^/]+/.test(path);
  useEffect(() => { setOpen(false); setCopied(false); }, [path]);
  if (!show) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof document !== "undefined" ? document.title : "Keshava Seva Samiti";
  const waText = `Check out this KSS page:\n${title} — ${url}\nKeshava Seva Samiti is transforming lives in Bengaluru since 1999 🙏`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="kss-share-root">
      <button className="kss-share-btn" onClick={() => setOpen((v) => !v)} aria-label="Share">
        <Share2 className="h-4 w-4" /> Share
      </button>
      {open && (
        <div className="kss-share-panel">
          <div className="kss-share-title">Share this page</div>
          <a className="kss-share-row" href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer">🟢 WhatsApp</a>
          <a className="kss-share-row" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">🔵 Facebook</a>
          <a className="kss-share-row" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer">🐦 Twitter / X</a>
          <button className="kss-share-row" onClick={copy}>🔗 {copied ? "✓ Copied!" : "Copy Link"}</button>
        </div>
      )}
    </div>
  );
}
