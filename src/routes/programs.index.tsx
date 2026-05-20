import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[340px] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data ?? []).map((p: any, i: number) => {
              const img = p.thumbnail_url || p.banner_url || FALLBACKS[i % FALLBACKS.length];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-2xl group shadow-soft hover:shadow-elevated h-[340px]"
                >
                  <Link to="/programs/$slug" params={{ slug: p.slug }} className="block h-full w-full">
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:-translate-y-5 group-hover:scale-[1.03]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                    </div>
                    {p.category && (
                      <span className="absolute top-4 left-4 z-10 inline-block text-[10px] font-semibold uppercase tracking-wider text-white bg-[#E8540A] px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    )}
                    <div className="absolute left-5 bottom-5 z-10 text-white drop-shadow font-serif text-xl md:text-2xl font-semibold transition-opacity duration-200 group-hover:opacity-0">
                      {p.title}
                    </div>
                    <div
                      className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 bg-[#FAF7F2]/95 backdrop-blur-sm p-5"
                      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    >
                      <h3 className="font-serif text-xl font-semibold text-[#1a1a1a]">{p.title}</h3>
                      {p.summary && <p className="mt-1.5 text-sm text-neutral-700 line-clamp-2">{p.summary}</p>}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#E8540A]">
                        Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
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
