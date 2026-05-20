import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Flower2, Drama, Baby, Sparkles, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCardImages, CARD_IMAGE_SLOTS } from "@/lib/card-images";

const HIGHLIGHTS = [
  { slot: "ph_education", icon: GraduationCap, title: "Education", body: "Academic support, essentials, guidance and encouragement so children continue their learning journey." },
  { slot: "ph_women", icon: Flower2, title: "Women Empowerment", body: "Skill development, livelihood opportunities, health awareness and civic participation for women." },
  { slot: "ph_culture", icon: Drama, title: "Culture & Values", body: "Bharatiya values embedded into camps and events that promote teamwork, leadership and harmony." },
  { slot: "ph_balasangam", icon: Baby, title: "BalaSangam", body: "Our flagship annual children's event — sports, creativity and learning at scale." },
  { slot: "ph_yoga", icon: Sparkles, title: "Yoga Day", body: "Large-scale community participation in International Yoga Day for physical and mental well-being." },
  { slot: "ph_seva_bastis", icon: BookOpen, title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations bringing education, healthcare and care." },
];

// Asymmetric masonry on a 6-col grid
const SPANS = [
  "md:col-span-2 md:row-span-2 aspect-[1/1.3]", // tall
  "md:col-span-2 aspect-[1.6/1]",
  "md:col-span-2 aspect-[1.6/1]",
  "md:col-span-3 aspect-[1.6/1]",
  "md:col-span-3 aspect-[1.6/1]",
  "md:col-span-2 md:row-span-2 aspect-[1/1.3]",
];

export default function ProgramHighlightsGrid() {
  const { data: overrides } = useCardImages();
  const fallbackMap = Object.fromEntries(CARD_IMAGE_SLOTS.map((s) => [s.id, s.fallback]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 auto-rows-auto">
      {HIGHLIGHTS.map((h, i) => {
        const img = overrides?.[h.slot] || fallbackMap[h.slot];
        const Icon = h.icon;
        return (
          <motion.div
            key={h.slot}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            className={`relative overflow-hidden rounded-2xl group shadow-soft hover:shadow-elevated ${SPANS[i % SPANS.length]}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={img}
                alt={h.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:-translate-y-4"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
            </div>

            <div className="absolute left-5 bottom-5 z-10 text-white drop-shadow transition-opacity duration-200 group-hover:opacity-0">
              <div className="font-serif text-lg md:text-xl font-semibold">{h.title}</div>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#FAF7F2]/95 backdrop-blur-sm p-5"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              <Icon className="h-5 w-5 text-[#E8540A] mb-1.5" />
              <h3 className="font-serif text-lg md:text-xl font-semibold text-[#1a1a1a]">{h.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-700 line-clamp-3">{h.body}</p>
              <Link to="/programs" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#E8540A]">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
