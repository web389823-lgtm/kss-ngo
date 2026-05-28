import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import KssCard from "@/components/site/KssCard";

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
          <div className="kss-cards-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full rounded-2xl" style={{ aspectRatio: "16 / 9" }} />
            ))}
          </div>
        ) : (
          <div className="kss-cards-grid">
            {(data ?? []).map((p: any, i: number) => {
              const img = p.thumbnail_url || p.banner_url || FALLBACKS[i % FALLBACKS.length];
              const url = p.slug ? `/projects/${p.slug}` : "/projects";
              return (
                <KssCard
                  key={p.id}
                  image={img}
                  name={p.title}
                  category={p.location || undefined}
                  title={p.title}
                  description={p.description || undefined}
                  url={url}
                  readMoreLabel="View Project"
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
