import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { embedUrl } from "@/lib/video";

export const Route = createFileRoute("/programs/$slug")({
  component: ProgramDetail,
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery({
    queryKey: ["program", slug],
    queryFn: async () => {
      const { data } = await supabase.from("programs").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });
  const { data: related } = useQuery({
    queryKey: ["programs", "related", slug],
    queryFn: async () => (await supabase.from("programs").select("id,slug,title,thumbnail_url,banner_url,category").eq("status","active").neq("slug", slug).limit(3)).data ?? [],
  });

  if (isLoading) return <div className="container-page py-20 text-muted-foreground">Loading…</div>;
  if (!p) throw notFound();

  const video = embedUrl(p.video_url);

  return (
    <article className="animate-fade-in">
      <div className="container-page pt-10">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/programs"><ArrowLeft className="mr-1 h-4 w-4" />All programs</Link></Button>
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
        {p.category && <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">{p.category}</span>}
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold">{p.title}</h1>
        {p.summary && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{p.summary}</p>}
        {p.description && (
          <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
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
                <video src={video.src} controls className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        )}
      </div>
      {(related ?? []).length > 0 && (
        <section className="container-page pb-20">
          <h2 className="font-serif text-2xl font-semibold mb-6">Related programs</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {related!.map((r: any) => (
              <Link key={r.id} to="/programs/$slug" params={{ slug: r.slug }}>
                <Card className="overflow-hidden p-0 hover:shadow-elevated transition-all hover:-translate-y-0.5">
                  <div className="aspect-[16/9] gradient-saffron">
                    {(r.thumbnail_url || r.banner_url) && <img src={r.thumbnail_url || r.banner_url} alt={r.title} className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold">{r.title}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
