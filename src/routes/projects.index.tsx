import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data ?? []).map((p: any, i: number) => {
              const img = p.thumbnail_url || p.banner_url || FALLBACKS[i % FALLBACKS.length];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-2xl group shadow-soft hover:shadow-elevated aspect-video"
                >
                  <Link to="/projects/$slug" params={{ slug: p.slug }} className="block h-full w-full">
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:-translate-y-3.5 group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                    </div>
                    <div className="absolute left-5 bottom-5 right-5 z-10 flex items-end justify-between gap-3 text-white drop-shadow transition-opacity duration-200 group-hover:opacity-0">
                      <span className="font-serif text-lg md:text-xl font-semibold">{p.title}</span>
                      {p.location && (
                        <span className="flex items-center gap-1 text-xs opacity-90">
                          <MapPin className="h-3 w-3" />
                          {p.location}
                        </span>
                      )}
                    </div>
                    <div
                      className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#FAF7F2]/95 backdrop-blur-sm p-5"
                      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    >
                      <h3 className="font-serif text-lg font-semibold text-[#1a1a1a]">{p.title}</h3>
                      {p.description && <p className="mt-1.5 text-sm text-neutral-700 line-clamp-2">{p.description}</p>}
                      <div className="mt-2 flex items-center justify-between gap-3">
                        {p.location && (
                          <span className="flex items-center gap-1 text-xs text-neutral-600">
                            <MapPin className="h-3 w-3" />
                            {p.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#E8540A]">
                          View Project <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
