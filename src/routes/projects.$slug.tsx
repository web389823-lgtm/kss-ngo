import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { embedUrl } from "@/lib/video";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => (await supabase.from("projects").select("*").eq("slug", slug).maybeSingle()).data,
  });

  if (isLoading) return <div className="container-page py-20 text-muted-foreground">Loading…</div>;
  if (!p) throw notFound();

  const video = embedUrl(p.video_url);
  const gallery: string[] = Array.isArray(p.gallery_urls) ? p.gallery_urls : [];

  return (
    <article className="animate-fade-in">
      <div className="container-page pt-10">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/projects"><ArrowLeft className="mr-1 h-4 w-4" />All projects</Link></Button>
      </div>
      {(p.banner_url || p.thumbnail_url) && (
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img src={(p.banner_url || p.thumbnail_url) as string} alt={p.title}
              className="w-full max-h-[520px] object-cover animate-scale-in" />
          </div>
        </div>
      )}
      <div className="container-page py-12 max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">{p.status}</span>
          {p.location && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</span>}
          {p.project_date && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(p.project_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">{p.title}</h1>
        {p.description && (
          <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
            {p.description}
          </div>
        )}
        {video && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">Watch</h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-elevated">
              {video.kind === "iframe" ? (
                <iframe src={video.src} title={p.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="w-full h-full" />
              ) : (
                <video src={video.src} controls preload="metadata" playsInline className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        )}
        {gallery.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((g, i) => (
                <Card key={i} className="overflow-hidden p-0 hover:shadow-elevated transition-all">
                  <img src={g} alt={`${p.title} ${i + 1}`} loading="lazy" className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" />
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
