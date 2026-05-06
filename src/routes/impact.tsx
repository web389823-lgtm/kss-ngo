import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { GraduationCap, Home, Stethoscope, Sparkles, Users, Award } from "lucide-react";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
  head: () => ({ meta: [
    { title: "Impact — Keshava Seva Samiti" },
    { name: "description", content: "18 years of service in numbers — students helped, families supported, women empowered, health camps held." },
  ]}),
});

const ICONS: Record<string, any> = { GraduationCap, Home, Stethoscope, Sparkles, Users, Award };

function ImpactPage() {
  const { data } = useQuery({
    queryKey: ["impact"],
    queryFn: async () => (await supabase.from("impact_stats").select("*").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Impact" title="18 years of measurable change" description="Every number is a person, a family, a community — touched by your support." />
      <section className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {(data ?? []).map((s: any) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <Card key={s.id} className="p-8 text-center shadow-soft">
                <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="font-serif text-4xl md:text-5xl font-semibold">{s.value.toLocaleString()}{s.suffix}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
