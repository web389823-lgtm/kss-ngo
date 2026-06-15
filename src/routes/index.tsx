import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MissionTagline from "@/components/site/MissionTagline";
import VoicesOfAppreciation from "@/components/site/VoicesOfAppreciation";
import ImpactNumbers from "@/components/site/ImpactNumbers";
import ActiveInitiatives from "@/components/site/ActiveInitiatives";
import heroChildren from "@/assets/hero-children.jpg";
import communityGroup from "@/assets/kss-community-group.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Keshava Seva Samiti — Reach the Unreached" },
      { name: "description", content: "Bengaluru-based NGO transforming lives since 1999 through education, healthcare, women empowerment, culture and welfare." },
    ],
  }),
});

// ─────────────────────────────────────────────────────────────
// SECTION 2 — HERO (split layout)
// ─────────────────────────────────────────────────────────────
function HeroSplit() {
  return (
    <section style={{ background: "#fff", padding: "clamp(32px, 5vw, 64px) 0" }}>
      <div className="container-page grid gap-8 md:gap-12 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-1"
        >
          <div className="overflow-hidden rounded-2xl shadow-xl" style={{ aspectRatio: "4/3" }}>
            <img src={heroChildren} alt="KSS children and community" loading="eager"
              className="w-full h-full object-cover" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="order-2"
        >
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 800,
              color: "#E8540A",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            REACH THE<br />UNREACHED
          </h1>
          <p
            className="mt-6"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              color: "#333",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            Keshava Seva Samiti has been transforming lives since 1999 — bringing
            education, healthcare and empowerment to the underprivileged in
            Bengaluru and beyond. Join us in building a compassionate, inclusive society.
          </p>
          <Link
            to="/get-involved"
            className="inline-block mt-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "#E8540A",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              padding: "14px 36px",
              borderRadius: "999px",
              letterSpacing: "0.05em",
            }}
          >
            JOIN NOW
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — Full-width community photo
// ─────────────────────────────────────────────────────────────
function CommunityPhoto() {
  return (
    <section style={{ background: "#fff", padding: 0 }}>
      <motion.img
        src={communityGroup}
        alt="KSS community — volunteers and children"
        loading="lazy"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "560px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — Outreach Programs
// ─────────────────────────────────────────────────────────────
const OUTREACH_SLUGS = ["vidya-vahini", "arogya-bhagya", "balagokula", "padavi-uttejan", "nari-uttejan", "vishala-parivar"];

const OUTREACH_LABELS: Record<string, string> = {
  "vidya-vahini": "Vidya Vahini",
  "arogya-bhagya": "Arogya Bhagya",
  "balagokula": "Bala Gokula",
  "padavi-uttejan": "Padavi Uttejan",
  "nari-uttejan": "Nari Uttejan",
  "vishala-parivar": "Vishala Parivar",
};

function OutreachPrograms() {
  const { data } = useQuery({
    queryKey: ["outreach-programs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("programs")
        .select("slug,title,thumbnail_url")
        .in("slug", OUTREACH_SLUGS);
      return data ?? [];
    },
  });
  const map = new Map((data ?? []).map((p: any) => [p.slug, p]));

  return (
    <section style={{ background: "#FAF7F2", padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="container-page">
        <h2
          className="text-center"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            color: "#8B1A1A",
            fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
            letterSpacing: "0.08em",
          }}
        >
          ✦ OUTREACH PROGRAMS ✦
        </h2>
        <div
          className="mt-12 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", maxWidth: "1200px", margin: "48px auto 0" }}
        >
          {OUTREACH_SLUGS.map((slug, i) => {
            const p: any = map.get(slug);
            const label = OUTREACH_LABELS[slug];
            const img = p?.thumbnail_url || communityGroup;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to="/programs/$slug"
                  params={{ slug }}
                  className="block relative overflow-hidden rounded-xl group shadow-md hover:shadow-2xl transition-all"
                  style={{ aspectRatio: "4/5", background: "#000" }}
                >
                  <img
                    src={img}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(180deg, #B8761F 0%, #8B5A14 100%)",
                      color: "#fff",
                      textAlign: "center",
                      padding: "14px 12px",
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
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

// ─────────────────────────────────────────────────────────────
// SECTION 6 — Our Impact at a Glance
// ─────────────────────────────────────────────────────────────
const IMPACT_STATS = [
  { value: "14,88,000", label: "BENEFICIARIES" },
  { value: "150", label: "SEVA BASATHIS" },
  { value: "35,600+", label: "STUDENTS" },
  { value: "58,000+", label: "HEALTH CAMPS" },
  { value: "7,200", label: "VOCATIONAL TRAINING" },
  { value: "120", label: "RATION KITS" },
];

function ImpactGlance() {
  return (
    <section style={{ background: "#8B3A0E", padding: "clamp(56px, 7vw, 96px) 0", color: "#fff" }}>
      <div className="container-page">
        <h2
          className="text-center"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            color: "#fff",
            fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
            letterSpacing: "0.06em",
          }}
        >
          OUR IMPACT AT A GLANCE
        </h2>
        <div style={{ width: 60, height: 3, background: "#E8B86E", margin: "16px auto 0" }} />
        <div
          className="mt-14 grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", maxWidth: "1100px", margin: "56px auto 0" }}
        >
          {IMPACT_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                background: "linear-gradient(135deg, #D4A24C 0%, #B8761F 100%)",
                borderRadius: "12px",
                padding: "28px 16px",
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: "#fff",
                  letterSpacing: "0.12em",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 7 — Seva Moments (2x2 grid)
// ─────────────────────────────────────────────────────────────
const SEVA_VIDEOS = [
  { id: "1CLR2c_k4Yk", title: "KSS Video 1" },
  { id: "ooQP-qfjgxQ", title: "KSS Video 2" },
  { id: "AZ5P1_PQQkU", title: "KSS Video 3" },
  { id: "UlfHOIpal5A", title: "KSS Video 4" },
];

function SevaVideoTile({ v }: { v: { id: string; title: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }),
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const src = play
    ? `https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&playsinline=1&rel=0`
    : `https://www.youtube.com/embed/${v.id}?rel=0`;
  return (
    <div ref={ref} className="transition-all duration-300 hover:scale-[1.02]"
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: "12px", background: "#000", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
      <iframe src={src} title={v.title} frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen loading="lazy"
        style={{ width: "100%", height: "100%", border: 0 }} />
    </div>
  );
}

function SevaMoments() {
  return (
    <section style={{ background: "#FFFFFF", padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="container-page" style={{ maxWidth: 1100 }}>
        <div className="flex items-center justify-center gap-3 mb-10">
          <Camera className="h-7 w-7" style={{ color: "#E8540A" }} />
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontWeight: 800,
            color: "#1a1a1a", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "0.06em",
          }}>
            SEVA MOMENTS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEVA_VIDEOS.map((v) => <SevaVideoTile key={v.id} v={v} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 9 — Get In Touch form
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
    const { toast } = await import("sonner");
    if (error) { toast.error(error.message); return; }
    toast.success("Thank you! We'll be in touch soon.");
    setForm({ first_name: "", last_name: "", email: "", phone: "", address: "", message: "" });
    setErrors({});
  }

  const inputStyle: React.CSSProperties = {
    background: "#fff", borderRadius: "8px", padding: "12px 16px",
    border: "1.5px solid #e0e0e0", fontFamily: "Inter, sans-serif",
    fontSize: "14px", color: "#333", width: "100%", outline: "none",
    transition: "border-color 200ms, box-shadow 200ms",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#E8540A";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,84,10,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#e0e0e0";
    e.currentTarget.style.boxShadow = "none";
  };
  const labelStyle: React.CSSProperties = { color: "#333", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" };
  const errStyle: React.CSSProperties = { color: "#d32f2f", fontSize: "12px", marginTop: "4px" };

  return (
    <section id="get-in-touch" style={{ background: "#FFFFFF", padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "760px" }}>
        <div className="text-center">
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#1a1a1a", letterSpacing: "0.06em" }}>
            GET IN TOUCH
          </h2>
          <div style={{ width: 60, height: 3, background: "#E8540A", margin: "12px auto 36px" }} />
        </div>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>First name<span style={{ color: "#E8540A" }}>*</span></label>
              <input style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
              {errors.first_name && <p style={errStyle}>{errors.first_name}</p>}
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email<span style={{ color: "#E8540A" }}>*</span></label>
            <input type="email" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={form.email} onChange={(e) => update("email", e.target.value)} />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>Phone<span style={{ color: "#E8540A" }}>*</span></label>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ ...inputStyle, width: "auto", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇮🇳 +91</span>
              <input type="tel" style={{ ...inputStyle, flex: 1 }} onFocus={onFocus} onBlur={onBlur} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            {errors.phone && <p style={errStyle}>{errors.phone}</p>}
          </div>
          <div>
            <label style={labelStyle}>Address<span style={{ color: "#E8540A" }}>*</span></label>
            <input style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={form.address} onChange={(e) => update("address", e.target.value)} />
            {errors.address && <p style={errStyle}>{errors.address}</p>}
          </div>
          <div>
            <label style={labelStyle}>Message<span style={{ color: "#E8540A" }}>*</span></label>
            <textarea style={{ ...inputStyle, height: "120px", resize: "vertical" }} onFocus={onFocus} onBlur={onBlur}
              placeholder="Share your inquiries or ways to support our initiatives."
              value={form.message} onChange={(e) => update("message", e.target.value)} />
            {errors.message && <p style={errStyle}>{errors.message}</p>}
          </div>
          <div className="text-center mt-2">
            <button type="submit" disabled={submitting}
              className="transition-all hover:scale-[1.02] w-full md:w-auto"
              style={{
                background: "linear-gradient(135deg, #D4A24C 0%, #B8761F 100%)",
                color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700,
                fontSize: "15px", borderRadius: "8px", padding: "14px 52px",
                border: "none", cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1, letterSpacing: "0.05em",
                boxShadow: "0 4px 14px rgba(184,118,31,0.35)",
              }}>
              {submitting ? "SUBMITTING…" : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 10 — Map
// ─────────────────────────────────────────────────────────────
function OfficeMap() {
  return (
    <section style={{ background: "#FAF7F2", padding: 0 }}>
      <div style={{ width: "100%", height: "clamp(320px, 45vw, 480px)" }}>
        <iframe
          title="KSS Office Location"
          src="https://www.google.com/maps?q=No.237,+2nd+Cross+Road,+Pai+Layout,+Mahadevapura,+Bengaluru&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div>
      <HeroSplit />
      <MissionTagline />
      <CommunityPhoto />
      <OutreachPrograms />
      <ActiveInitiatives />
      <ImpactNumbers />
      <SevaMoments />
      <VoicesOfAppreciation />
      <GetInTouchForm />
      <OfficeMap />
    </div>
  );
}
