import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({ meta: [
    { title: "Our Team — Keshava Seva Samiti" },
    { name: "description", content: "Meet the advisors and trusted members who guide and lead KSS." },
  ]}),
});

function TeamPage() {
  const { data: advisors } = useQuery({
    queryKey: ["advisory_team"],
    queryFn: async () => (await supabase.from("advisory_team").select("*").order("sort_order")).data ?? [],
  });
  const { data: members } = useQuery({
    queryKey: ["trusted_members"],
    queryFn: async () => (await supabase.from("trusted_members").select("*").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Leadership" title="The people behind KSS" description="Advisors and trusted members who steward our mission." />
      <section className="container-page py-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Advisory Team</h2>
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {(advisors ?? []).map((m: any) => (
            <Card key={m.id} className="p-7 shadow-soft text-center">
              <div className="mx-auto h-24 w-24 rounded-full gradient-saffron mb-4" />
              <h3 className="font-serif text-lg font-semibold">{m.name}</h3>
              <p className="text-xs uppercase tracking-wider text-primary mt-1">{m.position}</p>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            </Card>
          ))}
        </div>
        <h2 className="font-serif text-2xl font-semibold mb-6">Trusted Members</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {(members ?? []).map((m: any) => (
            <Card key={m.id} className="p-7 shadow-soft text-center">
              <div className="mx-auto h-24 w-24 rounded-full gradient-saffron mb-4" />
              <h3 className="font-serif text-lg font-semibold">{m.name}</h3>
              <p className="text-xs uppercase tracking-wider text-primary mt-1">{m.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{m.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
