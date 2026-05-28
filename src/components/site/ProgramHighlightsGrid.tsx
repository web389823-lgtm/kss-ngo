import { GraduationCap, Flower2, Drama, Baby, Sparkles, BookOpen } from "lucide-react";
import { useCardImages, CARD_IMAGE_SLOTS } from "@/lib/card-images";
import KssCard from "./KssCard";

const HIGHLIGHTS = [
  { slot: "ph_education", icon: GraduationCap, category: "EDUCATION", title: "Education", body: "Academic support, essentials, guidance and encouragement so children continue their learning journey.", url: "/programs?category=education" },
  { slot: "ph_women", icon: Flower2, category: "EMPOWERMENT", title: "Women Empowerment", body: "Skill development, livelihood opportunities, health awareness and civic participation for women.", url: "/programs?category=women" },
  { slot: "ph_culture", icon: Drama, category: "CULTURE", title: "Culture & Values", body: "Bharatiya values embedded into camps and events that promote teamwork, leadership and harmony.", url: "/programs?category=culture" },
  { slot: "ph_balasangam", icon: Baby, category: "CHILDREN", title: "BalaSangam", body: "Our flagship annual children's event — sports, creativity and learning at scale.", url: "/programs/balasangam" },
  { slot: "ph_yoga", icon: Sparkles, category: "WELLNESS", title: "Yoga Day", body: "Large-scale community participation in International Yoga Day for physical and mental well-being.", url: "/programs/yoga-day" },
  { slot: "ph_seva_bastis", icon: BookOpen, category: "COMMUNITY", title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations bringing education, healthcare and care.", url: "/programs/seva-bastis" },
];

export default function ProgramHighlightsGrid() {
  const { data: overrides } = useCardImages();
  const fallbackMap = Object.fromEntries(CARD_IMAGE_SLOTS.map((s) => [s.id, s.fallback]));
  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="kss-cards-grid">
        {HIGHLIGHTS.map((h, i) => (
          <KssCard
            key={h.slot}
            image={(overrides as Record<string, string> | undefined)?.[h.slot] || fallbackMap[h.slot]}
            name={h.title}
            category={h.category}
            title={h.title}
            description={h.body}
            url={h.url}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
