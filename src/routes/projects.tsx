import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({ meta: [
    { title: "Projects — Keshava Seva Samiti" },
    { name: "description", content: "Recent and ongoing projects by KSS — drives, camps, launches and community initiatives." },
  ]}),
});

function ProjectsPage() {
  const { data } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => (await supabase.from("projects").select("*").eq("status", "active").order("project_date", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Our Work" title="Projects in action" description="A look at recent and ongoing community initiatives across India." />
      <section className="container-page py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data ?? []).map((p: any) => (
            <Card key={p.id} className="overflow-hidden p-0 shadow-soft hover:shadow-elevated transition-all">
              <div className="aspect-video gradient-saffron" />
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
                  {p.project_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.project_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
