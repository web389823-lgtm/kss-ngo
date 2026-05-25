import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; name: string; role: string | null; content: string; rating: number | null; photo_url: string | null };

function initials(name: string) {
  return name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ["testimonials_approved"],
    queryFn: async () => (await supabase.from("testimonials").select("*").eq("status" as any, "approved").order("created_at", { ascending: false })).data as T[] | null,
  });
  const items = data ?? [];
  const [open, setOpen] = useState(false);

  return (
    <section style={{ background: "#fff", padding: "clamp(48px, 6vw, 80px) 0" }}>
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            What People Say
          </h2>
          <div style={{ width: 60, height: 3, background: "#E8540A", margin: "12px auto 0" }} />
        </div>

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4, boxShadow: "0 10px 32px rgba(0,0,0,0.12)" }}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderTop: "3px solid #E8540A",
                }}
              >
                <div style={{ display: "flex", gap: 2, color: "#F59E0B", marginBottom: 12 }}>
                  {Array.from({ length: t.rating ?? 5 }).map((_, k) => (
                    <Star key={k} size={16} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontStyle: "italic", fontSize: 15, color: "#444", lineHeight: 1.7, margin: 0 }}>
                  "{t.content}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
                  {t.photo_url ? (
                    <img src={t.photo_url} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E8540A", color: "#fff", display: "grid", placeItems: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13 }}>
                      {initials(t.name)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#1a1a1a", fontSize: 14 }}>{t.name}</div>
                    {t.role && <div style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: 12 }}>{t.role}</div>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="transition-transform hover:scale-[1.02]"
            style={{
              background: "#E8540A",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 32px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c4470a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E8540A")}
          >
            ✍️ Leave a Review
          </button>
        </div>
      </div>

      <ReviewModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", role: "", stars: 5, review: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      name: form.name.trim(),
      role: form.role.trim() || null,
      content: form.review.trim(),
      rating: form.stars,
      status: "pending" as any,
      is_featured: false,
    } as any);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Thank you! Your review will appear after approval.", { duration: 4000 });
    setForm({ name: "", role: "", stars: 5, review: "" });
    qc.invalidateQueries({ queryKey: ["testimonials_approved"] });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "grid", placeItems: "center", padding: 16 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 12, padding: 24, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 20, margin: 0 }}>Leave a Review</h3>
              <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-4">
              <label style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444" }}>
                Name *
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full" style={inp} />
              </label>
              <label style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444" }}>
                Role / Location
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full" style={inp} />
              </label>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444", marginBottom: 6 }}>Star Rating *</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, stars: s })}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                      aria-label={`${s} stars`}
                    >
                      <Star size={22} fill={s <= form.stars ? "#F59E0B" : "transparent"} stroke="#F59E0B" />
                    </button>
                  ))}
                </div>
              </div>
              <label style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#444" }}>
                Your Review *
                <textarea required rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="mt-1 w-full" style={{ ...inp, resize: "vertical" }} />
              </label>
              <button
                type="submit"
                disabled={submitting}
                style={{ background: "#E8540A", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inp: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e0e0e0",
  borderRadius: 8,
  padding: "10px 12px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  outline: "none",
};
