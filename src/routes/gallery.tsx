import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [
    { title: "Gallery — Keshava Seva Samiti" },
    { name: "description", content: "Photos and videos from KSS events, programs, projects and volunteer activities." },
  ]}),
});

function ratioClass(r?: string) {
  switch (r) {
    case "9:16": return "aspect-[9/16]";
    case "1:1": return "aspect-square";
    case "4:3": return "aspect-[4/3]";
    default: return "aspect-video";
  }
}

function GalleryPage() {
  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (await supabase.from("gallery_items").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const items = data ?? [];
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Moments of seva" description="Photos and videos from our events, programs and on-the-ground initiatives." />
      <section className="container-page py-16">
        {items.length === 0 ? (
          <Card className="p-16 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Our gallery is being curated. Check back soon.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((g: any) => (
              <Card key={g.id} className="overflow-hidden group hover:shadow-elegant transition-all animate-fade-in">
                <div className={`${ratioClass(g.ratio)} bg-muted overflow-hidden`}>
                  {g.media_type === "video"
                    ? <video src={g.media_url} controls className="w-full h-full object-cover" />
                    : <img src={g.media_url} alt={g.title ?? "Gallery"} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
                </div>
                {(g.title || g.description) && (
                  <div className="p-3">
                    {g.title && <div className="font-medium text-sm truncate">{g.title}</div>}
                    {g.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.description}</div>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
