import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import communityGroup from "@/assets/kss-community-group.jpg";

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
  head: () => ({ meta: [
    { title: "News & Updates — Keshava Seva Samiti" },
    { name: "description", content: "Latest news, stories and field updates from KSS programs and projects." },
  ]}),
});

type Banner = { id: string; image_url: string | null; tag_label: string | null; headline: string | null; link_url: string | null; is_active: boolean };

function BlogPage() {
  const { data } = useQuery({
    queryKey: ["blog", "all"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false })).data ?? [],
  });
  const { data: banners } = useQuery({
    queryKey: ["news_banner"],
    queryFn: async () => (await supabase.from("news_banner" as any).select("*").eq("is_active", true).order("updated_at", { ascending: false }).limit(1)).data as Banner[] | null,
  });
  const banner = banners?.[0];
  const bannerImg = banner?.image_url || communityGroup;
  const headline = banner?.headline || "Latest from KSS";
  const tag = banner?.tag_label || "LATEST NEWS";
  const linkUrl = banner?.link_url || "";

  const bannerInner = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden group cursor-pointer mx-auto"
      style={{ width: "100%", maxWidth: 1200, aspectRatio: "16 / 9", maxHeight: 400, borderRadius: 16 }}
    >
      <motion.img
        src={bannerImg}
        alt={headline}
        loading="eager"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div className="absolute inset-0 transition-all" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
      <div className="absolute left-6 right-6 bottom-6 md:left-10 md:bottom-10 text-white">
        <span style={{ background: "#E8540A", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 11, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 12, letterSpacing: 1 }}>
          {tag}
        </span>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#fff", fontSize: "clamp(1.2rem, 2.5vw, 2rem)", margin: 0, maxWidth: 700, lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {headline}
        </h2>
        <div style={{ marginTop: 12, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#fff" }}>
          Read More →
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <PageHeader eyebrow="News & Updates" title="Stories from the field" description="Latest news, reflections and updates from our programs." />

      {/* HERO BANNER */}
      <section className="container-page mt-6 mb-2">
        {linkUrl ? (
          linkUrl.startsWith("/") ? (
            <Link to={linkUrl} className="block">{bannerInner}</Link>
          ) : (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">{bannerInner}</a>
          )
        ) : (
          bannerInner
        )}
      </section>

      <section className="container-page py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((p: any) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
              <Card className="overflow-hidden p-0 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in h-full">
                <div className="aspect-video w-full overflow-hidden bg-secondary">
                  {p.featured_image
                    ? <img src={p.featured_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    : <div className="w-full h-full gradient-saffron" />}
                </div>
                <div className="p-6">
                  {p.category && <p className="text-xs uppercase tracking-wider text-primary font-semibold">{p.category}</p>}
                  <h3 className="mt-2 font-serif text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt || p.content}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                </div>
              </Card>
            </Link>
          ))}
          {(data ?? []).length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">No posts published yet.</p>}
        </div>
      </section>
    </>
  );
}
