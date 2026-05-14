import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle()).data,
  });

  return (
    <section className="container-page py-10 max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate({ to: "/blog" })}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
      </Button>

      {isLoading ? (
        <div className="space-y-4 animate-fade-in">
          <Skeleton className="h-72 w-full rounded-lg" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : !data ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Article not found.</p>
          <Button asChild><Link to="/blog">Back to News</Link></Button>
        </div>
      ) : (
        <article className="animate-fade-in">
          {data.featured_image && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary mb-6">
              <img src={data.featured_image} alt={data.title} className="w-full h-full object-cover" />
            </div>
          )}
          {data.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              {data.category}
            </span>
          )}
          {data.published_at && (
            <p className="text-xs text-muted-foreground mt-3">
              {new Date(data.published_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-2">{data.title}</h1>
          {data.excerpt && <p className="mt-4 text-lg text-muted-foreground">{data.excerpt}</p>}
          {data.content && (
            <div className="prose prose-slate max-w-none mt-6 whitespace-pre-wrap leading-relaxed">
              {data.content}
            </div>
          )}
        </article>
      )}
    </section>
  );
}
