import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({ meta: [
    { title: "News & Updates — Keshava Seva Samiti" },
    { name: "description", content: "Latest news, stories and field updates from KSS programs and projects." },
  ]}),
});

function BlogPage() {
  const { data } = useQuery({
    queryKey: ["blog", "all"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false })).data ?? [],
  });
  return (
    <>
      <PageHeader eyebrow="News & Updates" title="Stories from the field" description="Latest news, reflections and updates from our programs." />
      <section className="container-page py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((p: any) => (
            <Card key={p.id} className="overflow-hidden p-0 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in">
              {/* Banner — landscape image first */}
              <div className="aspect-video w-full overflow-hidden bg-secondary">
                {p.featured_image
                  ? <img src={p.featured_image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  : <div className="w-full h-full gradient-saffron" />}
              </div>
              <div className="p-6">
                {p.category && <p className="text-xs uppercase tracking-wider text-primary font-semibold">{p.category}</p>}
                {/* Title below banner */}
                <h3 className="mt-2 font-serif text-xl font-semibold leading-snug">{p.title}</h3>
                {/* Description below title */}
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt || p.content}</p>
                <p className="mt-4 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
              </div>
            </Card>
          ))}
          {(data ?? []).length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">No posts published yet.</p>}
        </div>
      </section>
    </>
  );
}
