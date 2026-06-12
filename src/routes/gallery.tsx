import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FadeUp from "@/components/FadeUp";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [
    { title: "Gallery — Keshava Seva Samiti" },
    { name: "description", content: "Photos and videos from KSS events, programs, projects and volunteer activities." },
  ]}),
});

const ORANGE = "#ea580c";
const GALLERY_CATEGORIES = ["All", "Education", "Healthcare", "Women Empowerment", "Events", "Cultural Programs", "Community"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase" style={{ color: ORANGE, letterSpacing: "0.25em" }}>{children}</p>;
}

function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: ["gallery-all"],
    queryFn: async () => (await supabase.from("gallery_items").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const filtered = useMemo(() => {
    const items = (data ?? []).filter((g: any) => g.media_type !== "video");
    if (active === "All") return items;
    return items.filter((g: any) => (g.category ?? "").toLowerCase() === active.toLowerCase());
  }, [data, active]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="container-page py-20">
      <FadeUp>
        <div className="text-center">
          <SectionLabel>Our Gallery</SectionLabel>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl font-bold">Moments of Seva in Action</h1>
          <p className="mt-3 text-muted-foreground">A visual journey through our programs, events, and community stories.</p>
        </div>
      </FadeUp>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: active === c ? ORANGE : "transparent",
              color: active === c ? "#fff" : "#374151",
              border: `1px solid ${active === c ? ORANGE : "#e5e7eb"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">No gallery items in this category yet.</p>
      ) : (
        <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
          {filtered.map((g: any, i: number) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(i)}
              className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group bg-muted"
            >
              <img src={g.media_url} alt={g.title ?? "Gallery"} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end justify-center p-4 bg-black/0 group-hover:bg-black/70 transition-all duration-300">
                <p className="text-white font-medium text-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {g.title ?? ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white p-2 z-10"><X className="h-7 w-7" /></button>
            {lightbox! > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox! - 1); }} className="absolute left-5 text-white p-2"><ChevronLeft className="h-8 w-8" /></button>
            )}
            {lightbox! < filtered.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox! + 1); }} className="absolute right-5 text-white p-2"><ChevronRight className="h-8 w-8" /></button>
            )}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center"
            >
              <img src={current.media_url} alt={current.title ?? ""} className="object-contain rounded-lg" style={{ maxHeight: "85vh", maxWidth: "90vw" }} />
              {(current.title || current.category) && (
                <div className="mt-4 text-center text-white">
                  {current.title && <p className="font-semibold text-lg">{current.title}</p>}
                  {current.category && <p className="text-sm opacity-70">{current.category}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
