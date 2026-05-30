import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Target, Eye, Heart, Users, Home, Calendar, UserCheck,
  CheckCircle2, Mail, Phone, MapPin, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import FadeUp from "@/components/FadeUp";
import AnimatedNumber from "@/components/AnimatedNumber";
import FadeImage from "@/components/FadeImage";
import { supabase } from "@/integrations/supabase/client";
import aboutSeva from "@/assets/about-seva.jpg";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About — Keshava Seva Samiti" },
    { name: "description", content: "Since 1999, KSS has served lakhs across India through education, healthcare, women empowerment and welfare." },
  ]}),
});

const ORANGE = "#ea580c";
const PARTNERS = [
  "Seva Bharati", "Rotary Club", "Senior Citizen Welfare Association", "Govt. Ayush Hospital",
  "Q Hospitals", "ALE India Pvt. Ltd.", "Fidelity Services", "Bhima Jewellers",
  "Ultra Green Pvt. Ltd.", "Globe Eye Foundation", "Mouna Guru Swami Mutt", "Good Measure Foundation",
];
const GALLERY_CATEGORIES = ["All", "Education", "Healthcare", "Women Empowerment", "Events", "Cultural Programs", "Community"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase" style={{ color: ORANGE, letterSpacing: "0.25em" }}>
      {children}
    </p>
  );
}

function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Hero />
      <Intro />
      <Milestones />
      <MVV />
      <Impact />
      <Story />
      <Certifications />
      <Partners />
      <GallerySection />
      <TeamSection />
      <ContactStrip />
    </motion.div>
  );
}

type MilestoneRow = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  photo_url: string | null;
  link_url: string | null;
  link_text: string | null;
  display_order: number;
};

function Milestones() {
  const { data } = useQuery({
    queryKey: ["milestones-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones" as any)
        .select("*")
        .order("year", { ascending: false })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data as any[] as MilestoneRow[]) || [];
    },
  });

  const items = data || [];
  const [open, setOpen] = useState<MilestoneRow | null>(null);

  // Scroll-in observer
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".milestone-item").forEach((el) => el.classList.add("milestone-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("milestone-visible");
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".milestone-item").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  // Esc key close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const getYouTubeId = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return m ? m[1] : null;
  };

  return (
    <section className="py-20" style={{ background: "#fff", fontFamily: "'Assistant', sans-serif" }}>
      <style>{`
        .kss-tl-wrap { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .kss-tl-wrap::before {
          content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent 0%, #E8540A 5%, #E8540A 95%, transparent 100%);
          transform: translateX(-50%);
        }
        .milestone-row { position: relative; margin-bottom: 60px; min-height: 1px; }
        .kss-tl-pill {
          position: relative; z-index: 4; display: flex; justify-content: center; margin-bottom: 18px;
          opacity: 0; transform: scale(0.5);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }
        .milestone-row.milestone-visible .kss-tl-pill { opacity: 1; transform: scale(1); transition-delay: 0ms; }
        .kss-tl-pill span {
          background: #E8540A; color: #fff; font-family: 'Assistant', sans-serif; font-weight: 700;
          font-size: 18px; padding: 8px 24px; border-radius: 40px;
        }
        .milestone-item {
          position: relative; width: 45%; opacity: 0;
          transition: opacity 600ms ease-out, transform 600ms ease-out;
        }
        .milestone-item.left { margin-right: auto; transform: translateX(-80px); }
        .milestone-item.right { margin-left: auto; transform: translateX(80px); }
        .milestone-item.milestone-visible { opacity: 1 !important; transform: translateX(0) !important; transition-delay: 100ms; }
        .kss-tl-dot {
          position: absolute; left: 50%; top: 30px; transform: translateX(-50%) scale(0);
          width: 14px; height: 14px; border-radius: 50%; background: #E8540A;
          border: 3px solid #fff; box-shadow: 0 0 0 3px #E8540A; z-index: 5;
          transition: transform 300ms ease-out;
        }
        .milestone-row.milestone-visible .kss-tl-dot { transform: translateX(-50%) scale(1); transition-delay: 200ms; }
        .kss-tl-card {
          background: #fff; border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid rgba(232,84,10,0.10);
          cursor: pointer; transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
        }
        .kss-tl-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.12); border-color: rgba(232,84,10,0.25); }
        .kss-tl-photo {
          width: 100%; aspect-ratio: 16/9; overflow: hidden; display: block;
          background: linear-gradient(135deg, #E8540A 0%, #FF8C42 100%);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 28px; letter-spacing: 2px;
        }
        .kss-tl-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 400ms ease; }
        .kss-tl-card:hover .kss-tl-photo img { transform: scale(1.04); }
        .kss-tl-body { padding: 20px 22px; }
        .kss-tl-year { font-family: 'Assistant',sans-serif; font-weight: 600; font-size: 11px; color: #E8540A; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .kss-tl-title { font-family: 'Assistant',sans-serif; font-weight: 700; font-size: 18px; color: #1a1a1a; line-height: 1.3; margin-bottom: 8px; }
        .kss-tl-desc { font-family: 'Assistant',sans-serif; font-weight: 400; font-size: 13px; color: #666; line-height: 1.6;
          -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }
        .kss-tl-btn { font-family: 'Assistant',sans-serif; font-weight: 600; font-size: 13px; color: #fff; background: #E8540A; padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; transition: background 200ms ease, transform 200ms ease; }
        .kss-tl-btn:hover { background: #c94200; transform: translateY(-1px); }

        @media (max-width: 767px) {
          .kss-tl-wrap { padding-left: 32px; }
          .kss-tl-wrap::before { left: 12px; transform: none; background: #E8540A; }
          .milestone-item { width: auto; margin-left: 20px !important; margin-right: 0 !important; transform: translateX(50px); }
          .milestone-item.left, .milestone-item.right { transform: translateX(50px); }
          .kss-tl-pill { justify-content: flex-start; padding-left: 0; }
          .kss-tl-pill span { font-size: 15px; padding: 6px 18px; }
          .kss-tl-dot { left: -20px; transform: scale(0); }
          .milestone-row.milestone-visible .kss-tl-dot { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .milestone-item, .kss-tl-pill, .kss-tl-dot, .kss-tl-card, .kss-tl-photo img { transition: none !important; }
          .milestone-item { opacity: 1 !important; transform: none !important; }
          .kss-tl-pill { opacity: 1 !important; transform: none !important; }
          .kss-tl-dot { transform: translateX(-50%) scale(1) !important; }
        }

        .kss-tl-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: kssFadeIn 200ms ease; }
        .kss-tl-modal { max-width: 600px; width: 100%; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; animation: kssScaleIn 250ms ease; }
        @keyframes kssFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes kssScaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      <div className="text-center mb-12 px-4">
        <p style={{ fontFamily: "'Assistant',sans-serif", fontWeight: 600, fontSize: 12, color: "#E8540A", letterSpacing: 3, textTransform: "uppercase" }}>Our Journey</p>
        <h2 style={{ fontFamily: "'Assistant',sans-serif", fontWeight: 700, color: "#1a1a1a", fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: 8 }}>Milestones</h2>
        <div style={{ width: 60, height: 3, background: ORANGE, margin: "10px auto 0", borderRadius: 2 }} />
      </div>

      <div className="kss-tl-wrap">
        {items.map((m, idx) => {
          const side = idx % 2 === 0 ? "left" : "right";
          return (
            <div key={m.id} className="milestone-row">
              <div className="kss-tl-pill"><span>{m.year}</span></div>
              <div className="kss-tl-dot" />
              <div className={`milestone-item ${side}`} onClick={() => setOpen(m)}>
                <div className="kss-tl-card">
                  <div className="kss-tl-photo">
                    {m.photo_url ? <img src={m.photo_url} alt={m.title} loading="lazy" /> : <span>KSS</span>}
                  </div>
                  <div className="kss-tl-body">
                    <div className="kss-tl-year">{m.year}</div>
                    <h3 className="kss-tl-title">{m.title}</h3>
                    {m.description && <p className="kss-tl-desc">{m.description}</p>}
                    <button className="kss-tl-btn" onClick={(e) => { e.stopPropagation(); setOpen(m); }}>
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="kss-tl-modal-backdrop" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="kss-tl-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg,#E8540A,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 36, letterSpacing: 2 }}>
                {open.photo_url ? <img src={open.photo_url} alt={open.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <span>KSS</span>}
              </div>
              <button onClick={() => setOpen(null)} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ fontFamily: "'Assistant',sans-serif", fontWeight: 600, fontSize: 13, color: "#E8540A", letterSpacing: 2 }}>{open.year}</div>
              <h3 style={{ fontFamily: "'Assistant',sans-serif", fontWeight: 700, fontSize: 28, color: "#1a1a1a", margin: "6px 0 14px" }}>{open.title}</h3>
              {open.description && <p style={{ fontFamily: "'Assistant',sans-serif", fontWeight: 400, fontSize: 15, color: "#444", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{open.description}</p>}
              {open.link_url && (() => {
                const yt = getYouTubeId(open.link_url);
                return (
                  <a href={open.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 20, padding: "10px 22px", background: "#E8540A", color: "#fff", borderRadius: 24, fontFamily: "'Assistant',sans-serif", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                    {yt ? "Watch Video →" : (open.link_text || "Read More →")}
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}



function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF8F3 0%, #FFF8F0 100%)" }}>
      <div className="container-page py-20 md:py-28 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionLabel>About KSS</SectionLabel>
          <h1 className="mt-5 font-serif font-extrabold tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.15 }}>
            A Movement of Seva, Rooted in Dharma
          </h1>
          <p className="mt-6 mx-auto max-w-2xl" style={{ color: "#4b5563", fontSize: "1.15rem", lineHeight: 1.7 }}>
            Keshava Seva Samiti began in 1999 as a small group of volunteers determined to bring dignity, education, and care to those most in need. Today we serve thousands across India.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="container-page py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <FadeImage src={aboutSeva} alt="KSS volunteers serving the community" className="w-full h-[420px] object-cover" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel>Who We Are</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold leading-tight">
            25 Years of Unwavering Commitment to Service
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>Keshava Seva Samiti (KSS) is a charitable trust dedicated to uplifting families in seva basathis for over 25 years. Our mission is to integrate them into mainstream society through cultural and social initiatives.</p>
            <p>KSS focuses on education, healthcare, women's empowerment, and cultural education. With a strong commitment to social development we have impacted 14.88 lakh beneficiaries through various programs, fostering empowerment and better living conditions.</p>
            <p>We work primarily across North and Central Bengaluru, operating nearly 150 community centres across 65+ locations covering 72 constituencies.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MVV() {
  const cards = [
    { icon: Target, title: "Our Mission", text: "To integrate underprivileged communities into the mainstream through education, healthcare, women empowerment, and welfare programs that uphold dignity." },
    { icon: Eye, title: "Our Vision", text: "A society where every child learns, every woman is empowered, and every family lives with health, dignity, and hope." },
    { icon: Heart, title: "Our Values", text: "Selfless service, transparency, community-led action, cultural rootedness, and unwavering commitment to dharma." },
  ];
  return (
    <section className="container-page pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <FadeUp key={c.title} delay={i * 0.1}>
            <motion.div whileHover={{ y: -6 }} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow h-full">
              <c.icon className="h-8 w-8 mb-4" style={{ color: ORANGE }} />
              <h3 className="font-serif text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const stats = [
    { icon: Users, value: 1488000, label: "Beneficiaries", suffix: "+", display: (n: number) => `${(n / 100000).toFixed(2)} Lakh+` },
    { icon: Home, value: 150, label: "Seva Basathis", suffix: "" },
    { icon: Calendar, value: 25, label: "Years of Service", suffix: "+" },
    { icon: UserCheck, value: 650, label: "Active Volunteers", suffix: "+" },
  ];
  return (
    <section style={{ background: "#FFF3EC" }} className="py-20">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <s.icon className="h-7 w-7 mx-auto mb-3" style={{ color: ORANGE }} />
                <div className="font-serif text-3xl md:text-4xl font-extrabold" style={{ color: "#1a1a1a" }}>
                  {s.label === "Beneficiaries" ? (
                    <><AnimatedNumber value={14.88} decimals={2} /> Lakh+</>
                  ) : (
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const paragraphs = [
    "What began as a single tutoring centre in a Bengaluru slum has grown into a multi-program organisation working across education, healthcare, women empowerment and more. Our 650+ active volunteers and dedicated team carry forward the original mission every day.",
    "We believe that real change is community-led. Every program we run is designed in partnership with the people it serves, ensuring relevance, impact, and sustainability.",
    "From running 24 Seva Basti schools to organising 320+ medical camps and empowering over 4,000 women, the work is far from done. With your support, we keep going.",
  ];
  return (
    <section className="container-page py-20 max-w-3xl">
      <FadeUp>
        <SectionLabel>Our Story</SectionLabel>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">From a Single Tuition Centre to a Movement</h2>
      </FadeUp>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        {paragraphs.map((p, i) => (
          <FadeUp key={i} delay={i * 0.1}><p>{p}</p></FadeUp>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const certs = [
    { name: "80G Certified", desc: "Donations are eligible for full tax exemption under Section 80G of the Income Tax Act." },
    { name: "12A Registered", desc: "Income is exempted from tax under the Income Tax Act." },
    { name: "10A Approved", desc: "Ensures compliance under the new NGO tax regime." },
  ];
  return (
    <section style={{ background: "#f5f5f5" }} className="py-20">
      <div className="container-page grid md:grid-cols-3 gap-5">
        {certs.map((c, i) => (
          <FadeUp key={c.name} delay={i * 0.1}>
            <div className="bg-white rounded-xl p-7 shadow-sm h-full">
              <CheckCircle2 className="h-8 w-8 mb-4" style={{ color: "#16a34a" }} />
              <h3 className="font-bold text-lg">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="container-page py-20 text-center">
      <FadeUp>
        <SectionLabel>Our Partners</SectionLabel>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">Organizations We Work With</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">KSS works in partnership with leading organizations to maximize impact.</p>
      </FadeUp>
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {PARTNERS.map((p) => (
          <motion.span
            key={p}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="px-5 py-2 rounded-full border bg-white text-sm font-medium transition-colors duration-200 cursor-default"
            style={{ borderColor: ORANGE, color: ORANGE }}
            whileHover={{ backgroundColor: ORANGE, color: "#fff" }}
          >
            {p}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}

function GallerySection() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data } = useQuery({
    queryKey: ["gallery-all"],
    queryFn: async () => (await supabase.from("gallery_items").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const filtered = useMemo(() => {
    const items = (data ?? []).filter((g: any) => g.media_type !== "video");
    if (active === "All") return items;
    return items.filter((g: any) => (g.category ?? "").toLowerCase() === active.toLowerCase());
  }, [data, active]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section className="container-page py-20">
      <FadeUp>
        <div className="text-center">
          <SectionLabel>Our Gallery</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">Moments of Seva in Action</h2>
          <p className="mt-3 text-muted-foreground">A visual journey through our programs, events, and community stories.</p>
        </div>
      </FadeUp>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: active === c ? ORANGE : "transparent",
              color: active === c ? "#fff" : "#374151",
              border: `1px solid ${active === c ? ORANGE : "#e5e7eb"}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">No gallery items in this category yet.</p>
      ) : (
        <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
          {filtered.map((g: any, i: number) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(i)}
              className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group bg-muted"
            >
              <img src={g.media_url} alt={g.title ?? "Gallery"} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end justify-center p-4 bg-black/0 group-hover:bg-black/70 transition-all duration-300">
                <p className="text-white font-medium text-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {g.title ?? ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white p-2 z-10"><X className="h-7 w-7" /></button>
            {lightbox! > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox! - 1); }} className="absolute left-5 text-white p-2"><ChevronLeft className="h-8 w-8" /></button>
            )}
            {lightbox! < filtered.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox! + 1); }} className="absolute right-5 text-white p-2"><ChevronRight className="h-8 w-8" /></button>
            )}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center"
            >
              <img src={current.media_url} alt={current.title ?? ""} className="object-contain rounded-lg" style={{ maxHeight: "85vh", maxWidth: "90vw" }} />
              {(current.title || current.category) && (
                <div className="mt-4 text-center text-white">
                  {current.title && <p className="font-semibold text-lg">{current.title}</p>}
                  {current.category && <p className="text-sm opacity-70">{current.category}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MemberCard({ m, i, kind }: { m: any; i: number; kind: "advisory" | "trustee" }) {
  const navigate = useNavigate();
  const initials = (m.name ?? "").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
  const subtitle = m.position ?? m.role;
  const description = m.bio ?? m.description;
  const slug = m.slug ?? slugify(m.name ?? "");
  const to = kind === "advisory" ? `/about/advisory/${slug}` : `/about/trustee/${slug}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate({ to })}
      className="bg-card rounded-2xl p-7 text-center shadow-sm hover:shadow-xl transition-shadow group cursor-pointer"
    >
      <div className="mx-auto w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
        style={{ background: m.photo_url ? "transparent" : "linear-gradient(135deg, #f97316, #ea580c)" }}>
        {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : initials}
      </div>
      <h3 className="mt-4 font-bold text-lg transition-colors">{m.name}</h3>
      {subtitle && <p className="text-sm font-medium" style={{ color: ORANGE }}>{subtitle}</p>}
      {description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>}
      <p className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover:translate-x-1" style={{ color: ORANGE }}>
        View Profile →
      </p>
    </motion.div>
  );
}

function TeamSection() {
  const navigate = useNavigate();
  const { data: advisors } = useQuery({
    queryKey: ["advisory_team"],
    queryFn: async () => (await supabase.from("advisory_team").select("*").order("sort_order")).data ?? [],
  });
  const { data: trustees } = useQuery({
    queryKey: ["trusted_members"],
    queryFn: async () => (await supabase.from("trusted_members").select("*").order("sort_order")).data ?? [],
  });

  return (
    <section id="team" className="container-page py-20 scroll-mt-24">
      <FadeUp>
        <div className="text-center">
          <SectionLabel>Our Team</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">The People Behind KSS</h2>
          <p className="mt-3 text-muted-foreground">Meet the dedicated individuals driving our mission since 1999.</p>
        </div>
      </FadeUp>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Leadership</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Advisory Board</h3>
          <p className="mt-2 text-muted-foreground">Guiding KSS with wisdom, experience, and vision.</p>
        </FadeUp>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(advisors ?? []).map((m: any, i: number) => <MemberCard key={m.id} m={m} i={i} kind="advisory" />)}
        </div>
      </div>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Governance</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Trustee Board</h3>
          <p className="mt-2 text-muted-foreground">Our founding trustees who uphold our mission and values.</p>
        </FadeUp>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(trustees ?? []).map((m: any, i: number) => <MemberCard key={m.id} m={m} i={i} kind="trustee" />)}
        </div>
      </div>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Seva Warriors</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Our Dedicated Volunteers</h3>
          <p className="mt-2 text-muted-foreground">650+ volunteers who make our work possible every day.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-6 p-8 rounded-xl border-l-4" style={{ background: "#FFF3EC", borderColor: ORANGE }}>
            <p className="italic text-lg leading-relaxed text-foreground/90">
              "Every volunteer who joins KSS becomes part of a family dedicated to reaching the unreached. Their time, passion, and commitment transform lives every single day."
            </p>
            <p className="mt-4 font-semibold" style={{ color: ORANGE }}>— Prakash Raju, General Secretary, KSS</p>
            <button
              onClick={() => navigate({ to: "/get-involved" })}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105"
              style={{ background: ORANGE }}
            >
              Join as a Volunteer →
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ContactStrip() {
  const navigate = useNavigate();
  return (
    <section style={{ background: "#1a1a1a" }} className="text-white py-16">
      <div className="container-page grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-serif text-2xl font-bold">Get in Touch</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3"><Mail className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="mailto:kss.seva@gmail.com" className="hover:underline">kss.seva@gmail.com</a></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="tel:+919845487509" className="hover:underline">+91-9845487509</a></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="tel:+919900288341" className="hover:underline">+91-9900288341</a></li>
            <li className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><span>No.237, 2nd Cross Road, Pai Layout, Mahadevapura, Bengaluru, Karnataka 560016</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold">Support Our Work</h3>
          <div className="mt-5 space-y-2 text-sm text-white/85">
            <p><span className="text-white/60">Account Name:</span> Keshava Seva Samiti</p>
            <p><span className="text-white/60">Bank:</span> Union Bank</p>
            <p><span className="text-white/60">Account No:</span> 520101226076152</p>
            <p><span className="text-white/60">IFSC:</span> UBIN0533114</p>
          </div>
          <button
            onClick={() => navigate({ to: "/donate" })}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105"
            style={{ background: ORANGE }}
          >
            Donate Now →
          </button>
        </div>
      </div>
    </section>
  );
}
