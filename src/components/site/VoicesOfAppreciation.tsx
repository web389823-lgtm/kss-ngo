import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  if (tokens.length === 0) return text;
  // build a regex matching any token, case-insensitive
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) =>
    tokens.some((t) => t.toLowerCase() === p.toLowerCase()) ? (
      <em key={i} style={{ color: "#4CAF50", fontWeight: 700, fontStyle: "italic" }}>{p}</em>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

const HeartCurl = ({ flip = false }: { flip?: boolean }) => (
  <svg width="50" height="20" viewBox="0 0 60 24" fill="none" style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.55 }} aria-hidden>
    <path d="M2 12 C 10 4, 20 4, 28 12 C 32 8, 40 8, 44 14" stroke="#E8540A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M44 14 c -1 -3, 3 -5, 4 -2 c 1 -3, 5 -1, 4 2 c -1 2, -4 4, -4 4 s -3 -2, -4 -4 z" fill="#E8540A" />
  </svg>
);

export default function VoicesOfAppreciation() {
  const { data } = useQuery({
    queryKey: ["voa"],
    queryFn: async () => (await supabase.from("voices_of_appreciation" as any).select("*").order("display_order")).data as Voice[] | null,
  });
  const voices = data ?? [];
  const [idx, setIdx] = useState(0);
  const n = voices.length;

  useEffect(() => {
    if (n <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;
  const v = voices[Math.min(idx, n - 1)];

  return (
    <section style={{ background: "#FFFFFF", borderTop: "4px solid #E8540A", borderBottom: "4px solid #E8540A", padding: "clamp(48px, 6vw, 80px) 0" }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1000 }}>
        <div className="flex items-center justify-center gap-4 mb-8">
          <HeartCurl />
          <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "3px", color: "#1a1a1a", fontSize: "clamp(1rem, 2.2vw, 1.4rem)" }}>
            VOICES OF APPRECIATION
          </h2>
          <HeartCurl flip />
        </div>

        <div className="relative">
          <div className="voa-stage mx-auto" style={{ maxWidth: 900, position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="voa-card"
                style={{
                  background: "#FFF8F5",
                  border: "1px solid rgba(232,84,10,0.15)",
                  borderRadius: 20,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                  padding: "48px 64px",
                  display: "flex",
                  alignItems: "center",
                  gap: 48,
                  aspectRatio: "16 / 9",
                }}
              >
                <div style={{ flex: "0 0 35%", textAlign: "center" }}>
                  {v.photo_url && (
                    <img
                      src={v.photo_url}
                      alt={v.name}
                      loading="lazy"
                      style={{
                        width: 160,
                        height: 160,
                        objectFit: "cover",
                        border: "4px solid #E8540A",
                        borderRadius: "50%",
                        boxShadow: "0 4px 20px rgba(232,84,10,0.2)",
                        margin: "0 auto 16px",
                      }}
                    />
                  )}
                  <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: 16 }}>{v.name}</div>
                  {v.title && <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#888", fontSize: 13, marginTop: 4 }}>{v.title}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 60, color: "#E8540A", opacity: 0.3, lineHeight: 1, fontFamily: "serif" }}>❝</div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontStyle: "italic", fontSize: 18, color: "#2a2a2a", lineHeight: 1.8, margin: 0 }}>
                    {highlight(v.quote, v.highlight_words)}
                  </p>
                  <div style={{ width: 40, height: 3, background: "#E8540A", margin: "16px 0" }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {n > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() => setIdx((x) => (x - 1 + n) % n)}
                className="voa-arrow"
                style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => setIdx((x) => (x + 1) % n)}
                className="voa-arrow"
                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {n > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {voices.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 10 : 8,
                  height: i === idx ? 10 : 8,
                  borderRadius: "50%",
                  background: i === idx ? "#E8540A" : "#ccc",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 250ms",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .voa-arrow {
          width: 40px; height: 40px; border-radius: 50%;
          background: #fff; border: none; cursor: pointer;
          display: grid; place-items: center; color: #E8540A;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          transition: all 200ms ease;
        }
        .voa-arrow:hover { background: #E8540A; color: #fff; transform: translateY(-50%) scale(1.1); }
        @media (max-width: 768px) {
          .voa-card {
            flex-direction: column !important;
            padding: 24px !important;
            gap: 16px !important;
            aspect-ratio: auto !important;
            text-align: center;
          }
          .voa-card > div:first-child img { width: 100px !important; height: 100px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .voa-card, .voa-arrow { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
