import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import communityGroup from "@/assets/kss-community-group.jpg";

// Slugs + curated descriptions for the homepage Active Initiatives block.
const INITIATIVES: { slug: string; title: string; description: string }[] = [
  { slug: "vidya-bhagya", title: "Vidya Bhagya", description: "Free tuition centers supporting 1,600 children." },
  { slug: "vidya-vahini", title: "Vidya Vahini", description: "Scholarship support for 27 girls in higher education." },
  { slug: "padavi-uttejan", title: "Padavi Uttejan", description: "Infrastructure and aid for girls completing degrees." },
  { slug: "balagokula", title: "Balagokula", description: "Yoga, storytelling and values for 1.25 lakh children." },
  { slug: "arogya-bhagya", title: "Arogya Bhagya", description: "Free health camps reaching 58,000+ people." },
  { slug: "nari-uttejan", title: "Nari Uttejan", description: "Livelihood skills training for 7,200+ women." },
  { slug: "vishala-parivar", title: "Vishala Parivar", description: "Monthly ration kits for 40 families." },
  { slug: "bala-sangama", title: "Bala Sangama", description: "Annual sports & cultural festival for 2,000+ children." },
];

export default function ActiveInitiatives() {
  const { data } = useQuery({
    queryKey: ["initiatives-thumbs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("programs")
        .select("slug,thumbnail_url,banner_url")
        .in("slug", INITIATIVES.map((i) => i.slug));
      return data ?? [];
    },
  });
  const imgFor = new Map((data ?? []).map((p: any) => [p.slug, p.thumbnail_url || p.banner_url]));

  return (
    <section style={{ background: "#FFFFFF", padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="container-page">
        <div className="text-center">
          <p style={{ color: "#E8540A", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.18em" }}>
            OUR PROGRAMS
          </p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, color: "#1a1a1a", fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", marginTop: 8 }}>
            Active initiatives
          </h2>
          <p style={{ marginTop: 12, color: "#666", fontFamily: "Inter, sans-serif", fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}>
            Programs running across communities right now.
          </p>
          <div style={{ width: 60, height: 3, background: "#E8540A", margin: "16px auto 0" }} />
        </div>

        <div
          className="mt-14 grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            maxWidth: 1200,
            margin: "48px auto 0",
          }}
        >
          {INITIATIVES.map((it, i) => {
            const img = imgFor.get(it.slug) || communityGroup;
            return (
              <motion.div
                key={it.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  to="/programs/$slug"
                  params={{ slug: it.slug }}
                  className="block group"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(232,84,10,0.15)",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                    transition: "transform 300ms ease, box-shadow 300ms ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(0,0,0,0.06)";
                  }}
                >
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#f5f5f5" }}>
                    <img
                      src={img}
                      alt={it.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 600ms ease",
                      }}
                      className="group-hover:scale-105"
                    />
                  </div>
                  <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "1.15rem", color: "#1a1a1a", margin: 0 }}>
                      {it.title}
                    </h3>
                    <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 14, color: "#666", lineHeight: 1.55, flex: 1 }}>
                      {it.description}
                    </p>
                    <span
                      style={{
                        marginTop: 14,
                        color: "#E8540A",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
