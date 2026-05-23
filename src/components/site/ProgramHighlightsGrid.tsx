import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Flower2, Drama, Baby, Sparkles, BookOpen } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useCardImages, CARD_IMAGE_SLOTS } from "@/lib/card-images";

const HIGHLIGHTS = [
  { slot: "ph_education", icon: GraduationCap, category: "Education", title: "Education", body: "Academic support, essentials, guidance and encouragement so children continue their learning journey." },
  { slot: "ph_women", icon: Flower2, category: "Empowerment", title: "Women Empowerment", body: "Skill development, livelihood opportunities, health awareness and civic participation for women." },
  { slot: "ph_culture", icon: Drama, category: "Culture", title: "Culture & Values", body: "Bharatiya values embedded into camps and events that promote teamwork, leadership and harmony." },
  { slot: "ph_balasangam", icon: Baby, category: "Children", title: "BalaSangam", body: "Our flagship annual children's event — sports, creativity and learning at scale." },
  { slot: "ph_yoga", icon: Sparkles, category: "Wellness", title: "Yoga Day", body: "Large-scale community participation in International Yoga Day for physical and mental well-being." },
  { slot: "ph_seva_bastis", icon: BookOpen, category: "Community", title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations bringing education, healthcare and care." },
];

export default function ProgramHighlightsGrid() {
  const { data: overrides } = useCardImages();
  const fallbackMap = Object.fromEntries(CARD_IMAGE_SLOTS.map((s) => [s.id, s.fallback]));
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  const handleCardClick = (i: number) => {
    const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
    if (!isTouch) {
      navigate({ to: "/programs" });
      return;
    }
    if (openIdx !== i) {
      setOpenIdx(i);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => navigate({ to: "/programs" }), 2000);
    } else {
      navigate({ to: "/programs" });
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
        {HIGHLIGHTS.map((h, i) => {
          const img = overrides?.[h.slot] || fallbackMap[h.slot];
          const Icon = h.icon;
          const col = i % 3;
          const isOpen = openIdx === i;
          return (
            <motion.article
              key={h.slot}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: col * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleCardClick(i)}
              className={`group relative w-full overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-pointer ${isOpen ? "is-open" : ""}`}
              style={{ aspectRatio: "16 / 9" }}
            >
              <img
                src={img}
                alt={h.title}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[400ms] group-hover:scale-[1.06] ${isOpen ? "scale-[1.06]" : ""}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className={`absolute inset-x-4 bottom-4 z-10 text-white drop-shadow transition-opacity duration-300 group-hover:opacity-0 ${isOpen ? "opacity-0" : ""}`}>
                <h3 className="font-serif text-lg md:text-xl font-bold leading-tight">{h.title}</h3>
              </div>

              <div
                className={`absolute inset-0 bg-black/45 transition-opacity duration-[400ms] group-hover:opacity-100 ${isOpen ? "opacity-100" : "opacity-0"}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
              />
              <div
                className={`absolute inset-x-0 bottom-0 z-20 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-[400ms] bg-[#FAF7F2]/95 backdrop-blur-sm p-4 md:p-5 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{ height: "60%", transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8540A]">
                  <Icon className="h-3.5 w-3.5" />
                  {h.category}
                </div>
                <h3 className="mt-1.5 font-serif text-base md:text-lg font-bold text-[#1a1a1a] leading-snug">{h.title}</h3>
                <p className="mt-1.5 text-xs md:text-[13px] text-neutral-700 line-clamp-2 leading-relaxed">{h.body}</p>
                <Link to="/programs" onClick={(e) => e.stopPropagation()} className="mt-2 inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-[#E8540A]">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
      <p className="md:hidden text-center text-[12px] text-[#999] mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
        Tap any card to explore
      </p>
    </div>
  );
}
