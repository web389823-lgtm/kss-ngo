import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAutoPeek } from "@/lib/use-auto-peek";

export const Route = createFileRoute("/programs/")({
  component: ProgramsPage,
  head: () => ({
    meta: [
      { title: "Programs — Keshava Seva Samiti" },
      { name: "description", content: "Educational, healthcare, empowerment and welfare programs run by KSS across India." },
    ],
  }),
});

const FALLBACKS = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
  "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=1200",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200",
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200",
  "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200",
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200",
];

function ProgramCard({ p, img, i }: { p: any; img: string; i: number }) {
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
    </motion.div>
  );
}

function ProgramsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["programs", "all"],
    queryFn: async () => (await supabase.from("programs").select("*").eq("status", "active").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="What we do" title="Our Programs" description="Programs spanning education, healthcare, empowerment, culture and welfare — designed alongside the communities we serve." />
      <section className="container-page py-16">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ originX: 0 }}
          className="h-1 w-24 bg-[#E8540A] rounded-full mb-10"
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
              return <ProgramCard key={p.id} p={p} img={img} i={i} />;
            })}
          </div>
        )}
      </section>
    </>
  );
}
