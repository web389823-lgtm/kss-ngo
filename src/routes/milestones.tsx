import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/milestones")({
  component: MilestonesPage,
  head: () => ({ meta: [
    { title: "Milestones — Keshava Seva Samiti" },
    { name: "description", content: "Key milestones in the KSS journey since 1999." },
  ]}),
});

const ORANGE = "#ea580c";

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

function MilestonesPage() {
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
    document.querySelectorAll(".milestone-item, .milestone-row").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

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
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="py-20" style={{ background: "#fff", fontFamily: "'Assistant', sans-serif" }}>
      <style>{`
        .kss-tl-wrap { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .kss-tl-wrap::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, transparent 0%, #E8540A 5%, #E8540A 95%, transparent 100%); transform: translateX(-50%); }
        .milestone-row { position: relative; margin-bottom: 60px; min-height: 1px; }
        .kss-tl-pill { position: relative; z-index: 4; display: flex; justify-content: center; margin-bottom: 18px; opacity: 0; transform: scale(0.5); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .milestone-row.milestone-visible .kss-tl-pill { opacity: 1; transform: scale(1); transition-delay: 0ms; }
        .kss-tl-pill span { background: #E8540A; color: #fff; font-weight: 700; font-size: 18px; padding: 8px 24px; border-radius: 40px; }
        .milestone-item { position: relative; width: 45%; opacity: 0; transition: opacity 600ms ease-out, transform 600ms ease-out; }
        .milestone-item.left { margin-right: auto; transform: translateX(-80px); }
        .milestone-item.right { margin-left: auto; transform: translateX(80px); }
        .milestone-item.milestone-visible { opacity: 1 !important; transform: translateX(0) !important; transition-delay: 100ms; }
        .kss-tl-dot { position: absolute; left: 50%; top: 30px; transform: translateX(-50%) scale(0); width: 14px; height: 14px; border-radius: 50%; background: #E8540A; border: 3px solid #fff; box-shadow: 0 0 0 3px #E8540A; z-index: 5; transition: transform 300ms ease-out; }
        .milestone-row.milestone-visible .kss-tl-dot { transform: translateX(-50%) scale(1); transition-delay: 200ms; }
        .kss-tl-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid rgba(232,84,10,0.10); cursor: pointer; transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease; }
        .kss-tl-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.12); border-color: rgba(232,84,10,0.25); }
        .kss-tl-photo { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: linear-gradient(135deg, #E8540A 0%, #FF8C42 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 28px; letter-spacing: 2px; }
        .kss-tl-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 400ms ease; }
        .kss-tl-card:hover .kss-tl-photo img { transform: scale(1.04); }
        .kss-tl-body { padding: 20px 22px; }
        .kss-tl-year { font-weight: 600; font-size: 11px; color: #E8540A; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .kss-tl-title { font-weight: 700; font-size: 18px; color: #1a1a1a; line-height: 1.3; margin-bottom: 8px; }
        .kss-tl-desc { font-weight: 400; font-size: 13px; color: #666; line-height: 1.6; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }
        .kss-tl-btn { font-weight: 600; font-size: 13px; color: #fff; background: #E8540A; padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; transition: background 200ms ease, transform 200ms ease; }
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
        .kss-tl-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: kssFadeIn 200ms ease; }
        .kss-tl-modal { max-width: 600px; width: 100%; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; animation: kssScaleIn 250ms ease; }
        @keyframes kssFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes kssScaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      <div className="text-center mb-12 px-4">
        <p style={{ fontWeight: 600, fontSize: 12, color: "#E8540A", letterSpacing: 3, textTransform: "uppercase" }}>Our Journey</p>
        <h1 style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: 8 }}>Milestones</h1>
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
                    <button className="kss-tl-btn" onClick={(e) => { e.stopPropagation(); setOpen(m); }}>Read More →</button>
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
              <div style={{ fontWeight: 600, fontSize: 13, color: "#E8540A", letterSpacing: 2 }}>{open.year}</div>
              <h3 style={{ fontWeight: 700, fontSize: 28, color: "#1a1a1a", margin: "6px 0 14px" }}>{open.title}</h3>
              {open.description && <p style={{ fontWeight: 400, fontSize: 15, color: "#444", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{open.description}</p>}
              {open.link_url && (() => {
                const yt = getYouTubeId(open.link_url);
                return (
                  <a href={open.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 20, padding: "10px 22px", background: "#E8540A", color: "#fff", borderRadius: 24, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                    {yt ? "Watch Video →" : (open.link_text || "Read More →")}
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
