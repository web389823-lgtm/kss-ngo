import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Voice = {
  id: string;
  name: string;
  title: string | null;
  quote: string;
  highlight_words: string | null;
  photo_url: string | null;
};

function highlight(text: string, words: string | null) {
  if (!words) return text;
  const tokens = words.split(",").map((s) => s.trim()).filter(Boolean);
  if (!tokens.length) return text;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    tokens.some((t) => t.toLowerCase() === p.toLowerCase()) ? (
      <span key={i} style={{ color: "#9BE85A", fontWeight: 700 }}>{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

const Curl = ({ flip = false }: { flip?: boolean }) => (
  <svg width="56" height="22" viewBox="0 0 60 24" fill="none" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.9 }}>
    <path d="M2 12 C 10 4, 20 4, 28 12 C 32 8, 40 8, 44 14" stroke="#FFB870" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M44 14 c -1 -3, 3 -5, 4 -2 c 1 -3, 5 -1, 4 2 c -1 2, -4 4, -4 4 s -3 -2, -4 -4 z" fill="#FFB870" />
  </svg>
);

export default function VoicesOfAppreciation() {
  const { data } = useQuery({
    queryKey: ["voa"],
    queryFn: async () =>
      (await supabase.from("voices_of_appreciation" as any).select("*").order("display_order")).data as Voice[] | null,
  });
  const voices = data ?? [];
  const n = voices.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const tref = useRef<number | null>(null);

  useEffect(() => {
    if (n <= 1 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tref.current = window.setInterval(() => setIdx((x) => (x + 1) % n), 4000);
    return () => { if (tref.current) window.clearInterval(tref.current); };
  }, [n, paused]);

  if (n === 0) return null;
  const v = voices[Math.min(idx, n - 1)];

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #7A2008 0%, #8B2500 50%, #6F1C06 100%)",
        padding: "clamp(56px, 7vw, 96px) 0",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1000 }}>
        <div className="flex items-center justify-center gap-4 mb-10">
          <Curl />
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, letterSpacing: "3px", color: "#fff", fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)", margin: 0 }}>
            ♡ VOICES OF APPRECIATION ♡
          </h2>
          <Curl flip />
        </div>

        <div style={{ minHeight: 360, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ textAlign: "center", padding: "0 clamp(8px, 4vw, 40px)" }}
            >
              {v.photo_url && (
                <img
                  src={v.photo_url}
                  alt={v.name}
                  loading="lazy"
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                    margin: "0 auto 24px",
                    display: "block",
                  }}
                />
              )}
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                  lineHeight: 1.7,
                  color: "#FFF6EC",
                  maxWidth: 780,
                  margin: "0 auto",
                }}
              >
                "{highlight(v.quote, v.highlight_words)}"
              </p>
              <div
                style={{
                  marginTop: 22,
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#FFB870",
                  fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                  letterSpacing: "0.02em",
                }}
              >
                — {v.name}{v.title ? `, ${v.title}` : ""}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {n > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {voices.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 28 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: i === idx ? "#FFB870" : "rgba(255,255,255,0.45)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 300ms ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
