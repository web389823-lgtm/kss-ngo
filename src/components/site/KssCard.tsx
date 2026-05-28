import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type KssCardProps = {
  image: string;
  name: string;
  category?: string;
  title: string;
  description?: string;
  url: string;
  readMoreLabel?: string;
  index?: number;
};

export default function KssCard({
  image,
  name,
  category,
  title,
  description,
  url,
  readMoreLabel = "Read More",
  index = 0,
}: KssCardProps) {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside tap (touch)
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("touchstart", handler, { passive: true });
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("mousedown", handler);
    };
  }, [isActive]);

  const go = () => {
    if (url.startsWith("http") || url.includes("?") || url.includes("#")) {
      window.location.href = url;
    } else {
      navigate({ to: url }).catch(() => { window.location.href = url; });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".kss-card-readmore")) {
      e.preventDefault();
      e.stopPropagation();
      go();
      return;
    }
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      if (isActive) go();
      else setIsActive(true);
    } else {
      go();
    }
  };

  return (
    <motion.div
      ref={ref}
      data-url={url}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: "easeOut" }}
      onClick={handleClick}
      className={`kss-card${isActive ? " is-active" : ""}`}
    >
      <div className="kss-card-photo">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="kss-card-gradient" />
      <div className="kss-card-name">{name}</div>
      <div className="kss-card-panel">
        {category && <span className="kss-card-category">{category}</span>}
        <h4 className="kss-card-title">{title}</h4>
        {description && <p className="kss-card-desc">{description}</p>}
        <a
          href={url}
          className="kss-card-readmore"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go();
          }}
        >
          {readMoreLabel} →
        </a>
      </div>
    </motion.div>
  );
}
