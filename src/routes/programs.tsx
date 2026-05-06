import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/programs")({
  component: ProgramsPage,
  head: () => ({ meta: [
    { title: "Programs — Keshava Seva Samiti" },
    { name: "description", content: "Explore the educational, healthcare, empowerment and welfare programs run by KSS across India." },
  ]}),
});

function ProgramsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["programs", "all"],
    queryFn: async () => (await supabase.from("programs").select("*").eq("status", "active").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="What we do" title="Programs that uplift communities" description="Eleven core programs spanning education, healthcare, empowerment, culture and welfare — designed alongside the communities we serve." />
      <section className="container-page py-16">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data ?? []).map((p: any) => (
              <Card key={p.id} className="p-6 shadow-soft hover:shadow-elevated transition-shadow">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">{p.category}</p>
                <h3 className="mt-2 font-serif text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                {p.description && <p className="mt-3 text-sm">{p.description}</p>}
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
