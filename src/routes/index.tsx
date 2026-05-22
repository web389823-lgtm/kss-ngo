import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Heart, Sparkles, GraduationCap, Home as HomeIcon,
  Stethoscope, Users, Award, Quote, BookOpen, Drama, Baby, Flower2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/site/Counter";
import MissionTagline from "@/components/site/MissionTagline";
import ProgramPhotoGrid from "@/components/site/ProgramPhotoGrid";
import ProgramHighlightsGrid from "@/components/site/ProgramHighlightsGrid";

const DEFAULT_HERO_SLIDES = [
  "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1600",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600",
  "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=1600",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600",
  "https://images.unsplash.com/photo-1578496479932-143f47d35c09?w=1600",
];

function HeroSlideshow({ slides }: { slides: string[] }) {
  const [i, setI] = useState(0);
  const [pY, setPY] = useState(0);
  const n = slides.length;
  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPY(window.scrollY * 0.4));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  if (n === 0) return null;
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 will-change-transform" style={{ transform: `translate3d(0, ${pY}px, 0)` }}>
        {slides.map((src, idx) => (
          <img
            key={src + idx}
            src={src}
            alt=""
            aria-hidden={idx !== i}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-[120%] w-full object-cover transition-opacity duration-1000 ease-out ${idx === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      {/* Floating decorative orange shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute h-72 w-72 rounded-full bg-[#E8540A] opacity-[0.06] blur-2xl animate-[kssFloat_8s_ease-in-out_infinite]" style={{ top: "12%", left: "8%" }} />
        <span className="absolute h-96 w-96 rounded-full bg-[#E8540A] opacity-[0.06] blur-2xl animate-[kssFloat_12s_ease-in-out_infinite]" style={{ top: "55%", right: "10%" }} />
        <span className="absolute h-56 w-56 rounded-full bg-[#E8540A] opacity-[0.06] blur-2xl animate-[kssFloat_10s_ease-in-out_infinite]" style={{ bottom: "8%", left: "30%" }} />
        <span className="absolute h-40 w-40 rounded-full bg-[#E8540A] opacity-[0.06] blur-2xl animate-[kssFloat_9s_ease-in-out_infinite]" style={{ top: "20%", right: "30%" }} />
      </div>
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setI((x) => (x - 1 + n) % n)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setI((x) => (x + 1) % n)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

import healthCamp from "@/assets/health-camp.jpg";
import womenWorkshop from "@/assets/women-workshop.jpg";
import groceryDrive from "@/assets/grocery-drive.jpg";
import communityGroup from "@/assets/kss-community-group.jpg";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Keshava Seva Samiti — Transforming lives since 1999" },
      { name: "description", content: "Bengaluru-based NGO serving marginalized communities through education, healthcare, women empowerment, culture and welfare. Donate or volunteer with KSS today." },
    ],
  }),
});

const ICONS: Record<string, any> = { GraduationCap, Home: HomeIcon, Stethoscope, Sparkles, Users, Award };

const PROGRAM_HIGHLIGHTS = [
  { icon: GraduationCap, title: "Education", body: "Education forms the core of KSS's work — academic support, access to essentials, guidance and encouragement for children to continue their learning journey with confidence. Equal emphasis on cultural grounding, discipline and character building." },
  { icon: Flower2, title: "Women Empowerment", body: "KSS supports women through skill development, livelihood opportunities and community-based initiatives. Programs also promote health awareness, hygiene, environmental responsibility and civic participation." },
  { icon: Drama, title: "Culture & Values", body: "KSS integrates Bharatiya values into its initiatives through camps, activities and events that promote teamwork, leadership and social harmony." },
  { icon: Baby, title: "BalaSangam", body: "Our flagship annual children's event, bringing together thousands of children to celebrate sports, creativity and learning while building confidence and discipline." },
  { icon: Sparkles, title: "Yoga Day", body: "KSS celebrates International Yoga Day through large-scale community participation — promoting physical health, mental well-being and awareness of yoga as a way of life." },
  { icon: BookOpen, title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations and 12 constituencies bring education, healthcare and care to where it is needed most." },
];

function HomePage() {
  const { data: stats } = useQuery({
    queryKey: ["impact_stats"],
    queryFn: async () => (await supabase.from("impact_stats").select("*").order("sort_order")).data ?? [],
  });
  const { data: programs } = useQuery({
    queryKey: ["programs", "home"],
    queryFn: async () => (await supabase.from("programs").select("*").eq("status", "active").order("sort_order").limit(6)).data ?? [],
  });
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials", "featured"],
    queryFn: async () => (await supabase.from("testimonials").select("*").eq("is_featured", true).limit(3)).data ?? [],
  });
  const { data: posts } = useQuery({
    queryKey: ["blog", "home"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3)).data ?? [],
  });
  // Advisory/Trustee sections removed from home page — they live on /about

  const { data: settings } = useQuery({
    queryKey: ["site_settings_home"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["home_hero", "home_about", "home_mission_vision", "home_contact"]);
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value));
      return map;
    },
  });

  const heroCfg = settings?.home_hero ?? {};
  const about = settings?.home_about ?? {};
  const mv = settings?.home_mission_vision ?? {};
  const contact = settings?.home_contact ?? {};

  return (
    <div>
      {/* HERO — fullscreen image slideshow */}
      <HeroSlideshow slides={Array.isArray(heroCfg.slides) && heroCfg.slides.length > 0 ? heroCfg.slides : DEFAULT_HERO_SLIDES} />


      {/* MISSION TAGLINE */}
      <MissionTagline />

      {/* COMMUNITY PHOTO — strict 16:9 with side margins */}
      <section
        style={{
          marginTop: "clamp(24px, 4vw, 48px)",
          marginBottom: 0,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: "1200px",
            width: "calc(100% - 80px)",
            padding: "0 40px",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "16px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            }}
          >
            <motion.img
              src={communityGroup}
              alt="KSS community — teachers and children gathered together"
              loading="lazy"
              initial={{ scale: 1.03 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "30%",
                background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>
        <p
          className="mx-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: "#888",
            textAlign: "center",
            padding: "12px 0 24px 0",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          KSS community — transforming lives across Bengaluru since 1999
        </p>
        <style>{`
          @media (max-width: 1024px) {
            section > div.mx-auto[style*="1200px"] { width: calc(100% - 48px) !important; padding: 0 24px !important; }
          }
          @media (max-width: 640px) {
            section > div.mx-auto[style*="1200px"] { width: calc(100% - 32px) !important; padding: 0 16px !important; }
          }
        `}</style>
      </section>



      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Impact</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Numbers that tell our story</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(stats ?? []).filter((s: any) => {
              const l = String(s.label ?? "").toLowerCase();
              return !l.includes("active program") && !l.includes("major project");
            }).map((s: any) => {
              const Icon = ICONS[s.icon] ?? Sparkles;
              return (
                <Card key={s.id} className="p-6 text-center shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                  <div className="font-serif text-xl md:text-2xl lg:text-[1.6rem] font-semibold tracking-tight tabular-nums break-words">
                    <Counter to={s.value} suffix={s.suffix ?? ""} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION & VISION removed from homepage — see /about */}


      {/* PROGRAM HIGHLIGHTS — photo cards with hover reveal */}
      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What We Do</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Program highlights</h2>
          </div>
          <ProgramHighlightsGrid />
          <div className="text-center mt-10">
            <Button asChild variant="outline"><Link to="/programs">View all programs <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* PROGRAMS FROM DB — photo-first interactive grid */}
      {(programs ?? []).length > 0 && (
        <section className="container-page py-16 max-w-[1600px]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Programs</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Active initiatives</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">Programs running across communities right now.</p>
          </div>
          <ProgramPhotoGrid
            programs={programs as any}
            fallbacks={[healthCamp, womenWorkshop, groceryDrive]}
          />
        </section>
      )}


      {/* WHY DONATE */}
      <section className="bg-muted/30 py-20">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Donate</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Every contribution creates ripples</h2>
            <p className="mt-5 text-muted-foreground">Your support directly funds the work that transforms lives across Bengaluru and beyond.</p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: GraduationCap, label: "Education for children" },
                { icon: Stethoscope, label: "Healthcare for communities" },
                { icon: HomeIcon, label: "Food and essential supplies" },
                { icon: Flower2, label: "Women empowerment programs" },
              ].map((i) => (
                <li key={i.label} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                    <i.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{i.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">Your support helps build a stronger, self-reliant society.</p>
            <Button asChild size="lg" className="mt-6"><Link to="/donate"><Heart className="mr-2 h-4 w-4" />Donate Now</Link></Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-saffron opacity-20 blur-2xl" />
            <img src={groceryDrive} alt="Ration kit distribution" className="relative rounded-2xl shadow-elevated object-cover aspect-[4/3] w-full" loading="lazy" />
          </div>
        </div>
      </section>

      {/* GET INVOLVED section removed from homepage */}

      {/* NEWS */}
      {(posts ?? []).length > 0 && (
        <section className="bg-muted/30 py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Latest</p>
                <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">News & updates</h2>
              </div>
              <Button asChild variant="ghost"><Link to="/blog">All news <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {(posts ?? []).map((p: any) => (
                <Card key={p.id} className="p-6 shadow-soft hover:shadow-elevated transition-shadow">
                  <p className="text-xs uppercase tracking-wider text-primary">{p.category}</p>
                  <h3 className="mt-2 font-serif text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {(testimonials ?? []).length > 0 && (
        <section className="container-page py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Voices</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Stories from those we serve</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {(testimonials ?? []).map((t: any) => (
              <Card key={t.id} className="p-7 shadow-soft">
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-4 text-sm leading-relaxed">"{t.content}"</p>
                <div className="mt-6">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Advisory & Trustee Board sections removed — see /about */}


      {/* SEVA MOMENTS — YouTube videos */}
      <SevaMoments />

      {/* GET IN TOUCH form */}
      <GetInTouchForm />

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SEVA MOMENTS — 4 YouTube videos
// ─────────────────────────────────────────────────────────────
const SEVA_VIDEOS = [
  { id: "1CLR2c_k4Yk", title: "KSS Video 1" },
  { id: "ooQP-qfjgxQ", title: "KSS Video 2" },
  { id: "AZ5P1_PQQkU", title: "KSS Video 3" },
  { id: "UlfHOIpal5A", title: "KSS Video 4" },
];

function SevaMoments() {
  return (
    <section style={{ background: "#C44B0A", padding: "clamp(40px, 6vw, 80px) 0" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80" style={{ fontFamily: "Inter, sans-serif" }}>Seva Moments</p>
          <h2 className="mt-3 text-white" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>
            Stories from the ground
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "16px" }}>
          {SEVA_VIDEOS.map((v) => (
            <div
              key={v.id}
              className="transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderRadius: "12px",
                background: "#000",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                style={{ width: "100%", height: "100%", borderRadius: "12px", display: "block", border: 0 }}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@KSS-SEVA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-colors duration-200"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              border: "1px solid #fff",
              borderRadius: "8px",
              padding: "10px 22px",
              background: "transparent",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#C44B0A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
          >
            View all videos on YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// GET IN TOUCH — form
// ─────────────────────────────────────────────────────────────
function GetInTouchForm() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", address: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.first_name.trim()) errs.first_name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions" as any).insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) {
      const { toast } = await import("sonner");
      toast.error(error.message);
      return;
    }
    const { toast } = await import("sonner");
    toast.success("Thank you! We'll be in touch soon.", { duration: 4000 });
    setForm({ first_name: "", last_name: "", email: "", phone: "", address: "", message: "" });
    setErrors({});
  }

  const inputStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "8px",
    padding: "12px 16px",
    border: "none",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    color: "#333",
    width: "100%",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
    display: "block",
    marginBottom: "6px",
  };
  const reqStyle: React.CSSProperties = { color: "#ffaaaa", marginLeft: 2 };
  const errStyle: React.CSSProperties = { color: "#ffaaaa", fontSize: "12px", marginTop: "4px", fontFamily: "Inter, sans-serif" };

  return (
    <section style={{ background: "#8B1A00", padding: "clamp(40px, 6vw, 80px) 0" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "760px" }}>
        <h2
          className="text-center text-white"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            marginBottom: "32px",
            letterSpacing: "0.04em",
          }}
        >
          GET IN TOUCH
        </h2>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>First name<span style={reqStyle}>*</span></label>
              <input style={inputStyle} value={form.first_name} onChange={(e) => update("first_name", e.target.value)} autoComplete="given-name" />
              {errors.first_name && <p style={errStyle}>{errors.first_name}</p>}
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input style={inputStyle} value={form.last_name} onChange={(e) => update("last_name", e.target.value)} autoComplete="family-name" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email<span style={reqStyle}>*</span></label>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>Phone<span style={reqStyle}>*</span></label>
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <span style={{ ...inputStyle, width: "auto", display: "inline-flex", alignItems: "center", gap: "6px", flex: "0 0 auto" }}>
                🇮🇳 +91
              </span>
              <input
                type="tel"
                style={{ ...inputStyle, flex: 1 }}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
            </div>
            {errors.phone && <p style={errStyle}>{errors.phone}</p>}
          </div>
          <div>
            <label style={labelStyle}>Address<span style={reqStyle}>*</span></label>
            <input style={inputStyle} value={form.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" />
            {errors.address && <p style={errStyle}>{errors.address}</p>}
          </div>
          <div>
            <label style={labelStyle}>We're here to listen and collaborate!<span style={reqStyle}>*</span></label>
            <textarea
              style={{ ...inputStyle, height: "120px", resize: "vertical" }}
              placeholder="Share your inquiries or ways to support our initiatives and create meaningful impact."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
            {errors.message && <p style={errStyle}>{errors.message}</p>}
          </div>
          <div className="text-center mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="transition-all duration-200 hover:scale-[1.02] w-full md:w-auto"
              style={{
                background: "#8B6914",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                borderRadius: "8px",
                padding: "14px 48px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#6e520f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#8B6914"; }}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

