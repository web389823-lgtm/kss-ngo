import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  component: TestimonialsPage,
  head: () => ({ meta: [
    { title: "Testimonials — Keshava Seva Samiti" },
    { name: "description", content: "Voices from beneficiaries, volunteers and donors who have been part of KSS's journey." },
  ]}),
});

function TestimonialsPage() {
  const { data } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="Voices" title="Stories of transformation" description="Beneficiaries, volunteers and donors share what KSS means to them." />
      <section className="container-page py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data ?? []).map((t: any) => (
            <Card key={t.id} className="p-7 shadow-soft">
              <Quote className="h-6 w-6 text-primary/40" />
              <p className="mt-4 text-sm leading-relaxed">"{t.content}"</p>
              {t.rating && (
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                </div>
              )}
              <div className="mt-6">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
