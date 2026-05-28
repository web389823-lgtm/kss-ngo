import KssCard from "./KssCard";

type Program = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  thumbnail_url?: string | null;
  banner_url?: string | null;
};

// Map known initiative slugs to canonical program URLs
const INITIATIVE_URL_MAP: Record<string, string> = {
  "vidya-bhagya": "/programs/vidya-bhagya",
  "vidya-vahini": "/programs/vidya-vahini",
  "padavi-uttejan": "/programs/padavi-uttejan",
  "balagokula": "/programs/balagokula",
  "balasamskara-kendra": "/programs/balasamskara",
  "balasamskara": "/programs/balasamskara",
  "bala-karanji": "/programs/bala-karanji",
  "nari-uttejan": "/programs/nari-uttejan",
  "vishala-parivar": "/programs/vishala-parivar",
};

export default function ProgramPhotoGrid({ programs, fallbacks }: { programs: Program[]; fallbacks: string[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="kss-cards-grid">
        {programs.map((p, i) => {
          const url = INITIATIVE_URL_MAP[p.slug] || (p.slug ? `/programs/${p.slug}` : "/programs");
          return (
            <KssCard
              key={p.id}
              image={p.thumbnail_url || p.banner_url || fallbacks[i % fallbacks.length]}
              name={p.title}
              category={p.category || undefined}
              title={p.title}
              description={p.summary || undefined}
              url={url}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}
