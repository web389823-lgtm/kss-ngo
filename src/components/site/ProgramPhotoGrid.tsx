import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Program = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  thumbnail_url?: string | null;
  banner_url?: string | null;
};

const SPANS = [
  "md:col-span-2 md:row-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[16/10]",
  "md:col-span-2 md:aspect-[16/10]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[16/10]",
  "md:col-span-2 md:aspect-[16/10]",
];

export default function ProgramPhotoGrid({ programs, fallbacks }: { programs: Program[]; fallbacks: string[] }) {
  return (
    <div
      className="
        flex md:grid overflow-x-auto md:overflow-visible
        snap-x snap-mandatory md:snap-none
        gap-3 md:grid-cols-4 auto-rows-auto
        -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0
      "
    >
      {programs.map((p, i) => {
        const img = p.thumbnail_url || p.banner_url || fallbacks[i % fallbacks.length];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-2xl group shadow-soft hover:shadow-elevated shrink-0 w-[82%] aspect-[4/5] snap-start ${SPANS[i % SPANS.length]} md:w-auto md:shrink`}
          >
            <Link to="/programs/$slug" params={{ slug: p.slug }} className="block h-full w-full">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:-translate-y-[18px] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
              </div>

              <div className="absolute left-5 bottom-5 z-10 text-white drop-shadow transition-opacity duration-200 group-hover:opacity-0">
                <div className="text-xs uppercase tracking-[0.2em] opacity-80">{p.category}</div>
                <div className="font-serif text-xl md:text-2xl font-semibold">{p.title}</div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-out bg-[#FAF7F2]/95 backdrop-blur-sm p-5 md:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8540A]">{p.category}</div>
                <h3 className="mt-1 font-serif text-xl md:text-2xl font-semibold text-[#1a1a1a]">{p.title}</h3>
                {p.summary && <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{p.summary}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#E8540A]">
                  Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
