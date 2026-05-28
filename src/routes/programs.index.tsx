import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import KssCard from "@/components/site/KssCard";

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
          <div className="kss-cards-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full rounded-2xl" style={{ aspectRatio: "16 / 9" }} />
            ))}
          </div>
        ) : (
          <div className="kss-cards-grid">
            {(data ?? []).map((p: any, i: number) => {
              const img = p.thumbnail_url || p.banner_url || FALLBACKS[i % FALLBACKS.length];
              const url = p.slug ? `/programs/${p.slug}` : "/programs";
              return (
                <KssCard
                  key={p.id}
                  image={img}
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
        )}
      </section>
    </>
  );
}
