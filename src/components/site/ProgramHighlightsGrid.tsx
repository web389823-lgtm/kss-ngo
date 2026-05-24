import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Flower2, Drama, Baby, Sparkles, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCardImages, CARD_IMAGE_SLOTS } from "@/lib/card-images";
import { useAutoPeek } from "@/lib/use-auto-peek";

const HIGHLIGHTS = [
  { slot: "ph_education", icon: GraduationCap, category: "EDUCATION", title: "Education", body: "Academic support, essentials, guidance and encouragement so children continue their learning journey." },
  { slot: "ph_women", icon: Flower2, category: "EMPOWERMENT", title: "Women Empowerment", body: "Skill development, livelihood opportunities, health awareness and civic participation for women." },
  { slot: "ph_culture", icon: Drama, category: "CULTURE", title: "Culture & Values", body: "Bharatiya values embedded into camps and events that promote teamwork, leadership and harmony." },
  { slot: "ph_balasangam", icon: Baby, category: "CHILDREN", title: "BalaSangam", body: "Our flagship annual children's event — sports, creativity and learning at scale." },
  { slot: "ph_yoga", icon: Sparkles, category: "WELLNESS", title: "Yoga Day", body: "Large-scale community participation in International Yoga Day for physical and mental well-being." },
  { slot: "ph_seva_bastis", icon: BookOpen, category: "COMMUNITY", title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations bringing education, healthcare and care." },
];

function HighlightCard({ h, col, fallbackMap, overrides }: { h: typeof HIGHLIGHTS[number]; col: number; fallbackMap: Record<string, string>; overrides: Record<string, string> | undefined }) {
  const [open, setOpen] = useState(false);
  const ref = useAutoPeek<HTMLDivElement>((o) => setOpen(o));
  const img = overrides?.[h.slot] || fallbackMap[h.slot];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: col * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => setOpen((o) => !o)}
      className={`group relative w-full overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] ${open ? "is-open" : ""}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={img}
        alt={h.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[400ms] group-hover:scale-[1.04]"
      />
      {/* Bottom 30% gradient + title */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/70 to-transparent" />
      <h3
        className="absolute left-5 bottom-4 z-10 text-white font-bold leading-tight pr-5"
        style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(1rem, 2vw, 1.25rem)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
      >
        {h.title}
      </h3>

      {/* White panel slide-up */}
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
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", color: "#E8540A", letterSpacing: "0.12em" }}>
          {h.category}
        </div>
        <h4 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginTop: "4px", lineHeight: 1.3 }}>
          {h.title}
        </h4>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#666", fontSize: "13px", lineHeight: 1.5, marginTop: "6px" }} className="line-clamp-2">
          {h.body}
        </p>
        <Link
          to="/programs"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#E8540A", marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          Read More <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function ProgramHighlightsGrid() {
  const { data: overrides } = useCardImages();
  const fallbackMap = Object.fromEntries(CARD_IMAGE_SLOTS.map((s) => [s.id, s.fallback]));

  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(8px, 1.5vw, 14px)" }}>
        {HIGHLIGHTS.map((h, i) => (
          <HighlightCard key={h.slot} h={h} col={i % 3} fallbackMap={fallbackMap} overrides={overrides} />
        ))}
      </div>
    </div>
  );
}
