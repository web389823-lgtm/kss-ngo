import { motion } from "framer-motion";

function Leaf({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      className="w-12 md:w-16 lg:w-20 h-auto text-[#C0392B]"
      aria-hidden
    >
      <path
        d="M5 60 C 25 20, 60 10, 110 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M30 45 q -8 -12 2 -22 q 14 4 12 18 q -6 6 -14 4 z" fill="currentColor" opacity="0.85" />
      <path d="M55 33 q -10 -10 -2 -22 q 14 0 14 16 q -4 8 -12 6 z" fill="currentColor" opacity="0.85" />
      <path d="M82 28 q -10 -8 -4 -20 q 14 -2 16 14 q -4 8 -12 6 z" fill="currentColor" opacity="0.85" />
      <circle cx="110" cy="25" r="3" fill="currentColor" />
    </svg>
  );
}

export default function MissionTagline() {
  return (
    <section
      className="bg-[#FAF7F2] overflow-hidden"
      style={{
        paddingTop: "clamp(24px, 3vw, 40px)",
        paddingBottom: "clamp(24px, 3vw, 40px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container-page flex items-center justify-center gap-3 md:gap-6"
      >
        <Leaf />
        <p
          className="text-center max-w-4xl"
          style={{
            color: "#3949AB",
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: "#2E7D32" }}>Seva</span>{" "}
          for lasting change, sustainable impact, and empowered{" "}
          <span style={{ color: "#E8540A" }}>communities.</span>
        </p>
        <Leaf flip />
      </motion.div>
    </section>
  );
}
