import { motion } from "framer-motion";

function Leaf({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      className="w-20 md:w-28 lg:w-32 h-auto text-[#C0392B]"
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
    <section className="bg-[#FAF7F2] py-20 md:py-28 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="container-page flex items-center justify-center gap-4 md:gap-10"
      >
        <Leaf />
        <p
          className="text-center font-serif text-2xl md:text-4xl lg:text-5xl leading-snug max-w-4xl"
          style={{ color: "#3949AB" }}
        >
          <span style={{ color: "#2E7D32", fontWeight: 700 }}>Seva</span>{" "}
          for lasting change, sustainable impact, and empowered{" "}
          <span style={{ color: "#E8540A", fontWeight: 700 }}>communities.</span>
        </p>
        <Leaf flip />
      </motion.div>
    </section>
  );
}
