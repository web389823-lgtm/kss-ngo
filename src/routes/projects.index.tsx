import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAutoPeek } from "@/lib/use-auto-peek";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — Keshava Seva Samiti" },
      { name: "description", content: "Recent and ongoing community initiatives by KSS across India." },
    ],
  }),
});

const FALLBACKS = [
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200",
  "https://images.unsplash.com/photo-1578496479932-143f47d35c09?w=1200",
];

function ProjectCard({ p, img, i }: { p: any; img: string; i: number }) {
  const [open, setOpen] = useState(false);
  const ref = useAutoPeek<HTMLDivElement>((o) => setOpen(o));
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
      onClick={() => setOpen((o) => !o)}
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated"
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
        {p.location && (
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px", color: "#999", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <MapPin className="h-3 w-3" /> {p.location}
          </div>
        )}
        <h4 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: "16px", marginTop: "4px", lineHeight: 1.3 }}>
          {p.title}
        </h4>
        {p.description && (
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#666", fontSize: "13px", lineHeight: 1.5, marginTop: "6px" }} className="line-clamp-2">
            {p.description}
          </p>
        )}
        <Link
          to="/projects/$slug"
          params={{ slug: p.slug }}
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#E8540A", marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          View Project <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => (await supabase.from("projects").select("*").eq("status", "active").order("project_date", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Our Work" title="Projects in action" description="A look at recent and ongoing community initiatives across India." />
      <section className="container-page py-16">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1 bg-[#E8540A] rounded-full mb-6"
        />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(8px, 1.5vw, 14px)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full rounded-2xl" style={{ aspectRatio: "16 / 9" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(8px, 1.5vw, 14px)" }}>
            {(data ?? []).map((p: any, i: number) => {
              const img = p.thumbnail_url || p.banner_url || FALLBACKS[i % FALLBACKS.length];
              return <ProjectCard key={p.id} p={p} img={img} i={i} />;
            })}
          </div>
        )}
      </section>
    </>
  );
}
