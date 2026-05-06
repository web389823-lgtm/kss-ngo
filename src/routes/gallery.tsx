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
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {items.map((g: any) => (
              <div key={g.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-soft">
                {g.media_type === "video"
                  ? <video src={g.media_url} controls className="w-full" />
                  : <img src={g.media_url} alt={g.title ?? "Gallery"} loading="lazy" className="w-full" />}
                {g.title && <div className="p-3 text-xs text-muted-foreground bg-card">{g.title}</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
