import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAutoPeek } from "@/lib/use-auto-peek";

type Program = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  thumbnail_url?: string | null;
  banner_url?: string | null;
};

function PhotoCard({ p, img, col }: { p: Program; img: string; col: number }) {
  const [open, setOpen] = useState(false);
  const ref = useAutoPeek<HTMLDivElement>((o) => setOpen(o));

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: col * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => setOpen((o) => !o)}
      className="group relative w-full overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={img}
        alt={p.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[400ms] group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/70 to-transparent" />
      <h3
        className="absolute left-5 bottom-4 z-10 text-white font-bold leading-tight pr-5"
        style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(1rem, 2vw, 1.25rem)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
      >
        {p.title}
      </h3>

      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-white group-hover:translate-y-0 group-focus-within:translate-y-0 ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{
          height: "50%",
          padding: "16px 20px",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          transition: "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {p.category && (
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", color: "#E8540A", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {p.category}
          </div>
        )}
        <h4 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginTop: "4px", lineHeight: 1.3 }}>
          {p.title}
        </h4>
        {p.summary && (
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#666", fontSize: "13px", lineHeight: 1.5, marginTop: "6px" }} className="line-clamp-2">
            {p.summary}
          </p>
        )}
        <Link
          to="/programs/$slug"
          params={{ slug: p.slug }}
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#E8540A", marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          Read More <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function ProgramPhotoGrid({ programs, fallbacks }: { programs: Program[]; fallbacks: string[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(8px, 1.5vw, 14px)" }}>
        {programs.map((p, i) => (
          <PhotoCard
            key={p.id}
            p={p}
            img={p.thumbnail_url || p.banner_url || fallbacks[i % fallbacks.length]}
            col={i % 3}
          />
        ))}
      </div>
    </div>
  );
}
