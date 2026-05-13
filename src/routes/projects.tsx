import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({ meta: [
    { title: "Projects — Keshava Seva Samiti" },
    { name: "description", content: "Recent and ongoing community initiatives by KSS across India." },
  ]}),
});

function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => (await supabase.from("projects").select("*").eq("status", "active").order("project_date", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Our Work" title="Projects in action" description="A look at recent and ongoing community initiatives across India." />
      <section className="container-page py-16">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden p-0"><Skeleton className="aspect-video w-full" /><div className="p-6 space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></div></Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data ?? []).map((p: any) => (
              <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="group">
                <Card className="overflow-hidden p-0 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 h-full animate-fade-in">
                  <div className="aspect-video gradient-saffron overflow-hidden">
                    {(p.thumbnail_url || p.banner_url) && (
                      <img src={p.thumbnail_url || p.banner_url} alt={p.title} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
                      {p.project_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.project_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>}
                    </div>
                    <div className="mt-3 inline-flex items-center text-sm text-primary font-medium">View project <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></div>
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
