import { useEffect, useState, useCallback } from "react";

type LightboxImg = { src: string; alt: string };

function collectImages(): HTMLImageElement[] {
  if (typeof document === "undefined") return [];
  const main = document.querySelector("main");
  if (!main) return [];
  return Array.from(main.querySelectorAll("img")).filter((img) => {
    if (img.closest("header,nav,footer,[data-no-lightbox]")) return false;
    if (img.dataset.lightboxIgnore === "true") return false;
    const r = img.getBoundingClientRect();
    return r.width > 80 && r.height > 80 && !!img.src && !img.src.includes("data:image/svg");
  });
}

export default function ImageLightbox() {
  const [imgs, setImgs] = useState<LightboxImg[]>([]);
  const [idx, setIdx] = useState(-1);

  const close = useCallback(() => setIdx(-1), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % imgs.length), [imgs.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || t.tagName !== "IMG") return;
      const img = t as HTMLImageElement;
      if (img.closest("a,button,header,nav,footer,[data-no-lightbox]")) return;
      if (img.dataset.lightboxIgnore === "true") return;
      const all = collectImages();
      const i = all.indexOf(img);
      if (i < 0) return;
      e.preventDefault();
      setImgs(all.map((el) => ({ src: el.currentSrc || el.src, alt: el.alt || "" })));
      setIdx(i);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (idx < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, next, prev]);

  if (idx < 0 || !imgs[idx]) return null;
  const cur = imgs[idx];

  let touchX = 0;
  const onTS = (e: React.TouchEvent) => { touchX = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 40) prev(); else if (dx < -40) next();
  };

  return (
    <div className="kss-lightbox" onClick={close} onTouchStart={onTS} onTouchEnd={onTE} role="dialog" aria-modal="true">
      <button className="kss-lb-close" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="Close">✕</button>
      {imgs.length > 1 && (
        <>
          <button className="kss-lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">←</button>
          <button className="kss-lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">→</button>
        </>
      )}
      <img className="kss-lb-img" src={cur.src} alt={cur.alt} onClick={(e) => e.stopPropagation()} />
      {cur.alt && <div className="kss-lb-caption">{cur.alt}</div>}
      {imgs.length > 1 && <div className="kss-lb-counter">{idx + 1} / {imgs.length}</div>}
    </div>
  );
}
