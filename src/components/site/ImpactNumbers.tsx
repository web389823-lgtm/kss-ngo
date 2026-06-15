import { motion } from "framer-motion";

const STATS = [
  { value: 25, suffix: "+", label: "Years of Service" },
  { value: 100, suffix: "", label: "Community Centres" },
  { value: 65, suffix: "+", label: "Locations" },
  { value: 12, suffix: "", label: "Constituencies" },
];

export default function ImpactNumbers() {
  return (
    <section style={{ background: "#FFFFFF", padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="container-page">
        <div className="text-center">
          <p style={{ color: "#E8540A", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.18em" }}>
            OUR IMPACT
          </p>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 800, color: "#1a1a1a", fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", marginTop: 8 }}>
            Reach across Bengaluru
          </h2>
          <div style={{ width: 60, height: 3, background: "#E8540A", margin: "16px auto 0" }} />
        </div>

        <div
          className="mt-14 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", maxWidth: 1000, margin: "56px auto 0" }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              style={{ textAlign: "center", padding: "8px 12px" }}
            >
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 800,
                  color: "#E8540A",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  lineHeight: 1.05,
                  display: "inline-flex",
                  alignItems: "baseline",
                }}
              >
                <span data-counter={s.value} data-counter-duration="1800">0</span>
                <span>{s.suffix}</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#666",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
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
