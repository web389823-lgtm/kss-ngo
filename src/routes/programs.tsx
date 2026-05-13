import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/programs")({
  component: ProgramsPage,
  head: () => ({ meta: [
    { title: "Programs — Keshava Seva Samiti" },
    { name: "description", content: "Educational, healthcare, empowerment and welfare programs run by KSS across India." },
  ]}),
});

function ProgramsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["programs", "all"],
    queryFn: async () => (await supabase.from("programs").select("*").eq("status", "active").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="What we do" title="Programs that uplift communities" description="Programs spanning education, healthcare, empowerment, culture and welfare — designed alongside the communities we serve." />
      <section className="container-page py-16">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden p-0"><Skeleton className="aspect-[16/9] w-full" /><div className="p-6 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></div></Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data ?? []).map((p: any) => (
              <Link key={p.id} to="/programs/$slug" params={{ slug: p.slug }} className="group">
                <Card className="overflow-hidden p-0 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 h-full animate-fade-in">
                  <div className="aspect-[16/9] gradient-saffron overflow-hidden">
                    {(p.thumbnail_url || p.banner_url) && (
                      <img src={p.thumbnail_url || p.banner_url} alt={p.title} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6">
                    {p.category && <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">{p.category}</span>}
                    <h3 className="mt-3 font-serif text-xl font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.summary}</p>
                    <div className="mt-4 inline-flex items-center text-sm text-primary font-medium">Read more <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
