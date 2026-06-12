import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import FadeUp from "@/components/FadeUp";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({ meta: [
    { title: "Our Team — Keshava Seva Samiti" },
    { name: "description", content: "Meet the advisors, trustees and volunteers who guide and lead KSS." },
  ]}),
});

const ORANGE = "#ea580c";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase" style={{ color: ORANGE, letterSpacing: "0.25em" }}>{children}</p>;
}

function MemberCard({ m, i, kind }: { m: any; i: number; kind: "advisory" | "trustee" }) {
  const navigate = useNavigate();
  const initials = (m.name ?? "").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
  const subtitle = m.position ?? m.role;
  const description = m.bio ?? m.description;
  const slug = m.slug ?? slugify(m.name ?? "");
  const to = kind === "advisory" ? `/about/advisory/${slug}` : `/about/trustee/${slug}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate({ to })}
      className="bg-card rounded-2xl p-7 text-center shadow-sm hover:shadow-xl transition-shadow group cursor-pointer"
    >
      <div className="mx-auto w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
        style={{ background: m.photo_url ? "transparent" : "linear-gradient(135deg, #f97316, #ea580c)" }}>
        {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : initials}
      </div>
      <h3 className="mt-4 font-bold text-lg transition-colors">{m.name}</h3>
      {subtitle && <p className="text-sm font-medium" style={{ color: ORANGE }}>{subtitle}</p>}
      {description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>}
      <p className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover:translate-x-1" style={{ color: ORANGE }}>
        View Profile →
      </p>
    </motion.div>
  );
}

function TeamPage() {
  const navigate = useNavigate();
  const { data: advisors } = useQuery({
    queryKey: ["advisory_team"],
    queryFn: async () => (await supabase.from("advisory_team").select("*").order("sort_order")).data ?? [],
  });
  const { data: trustees } = useQuery({
    queryKey: ["trusted_members"],
    queryFn: async () => (await supabase.from("trusted_members").select("*").order("sort_order")).data ?? [],
  });

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} id="team" className="container-page py-20 scroll-mt-24">
      <FadeUp>
        <div className="text-center">
          <SectionLabel>Our Team</SectionLabel>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl font-bold">The People Behind KSS</h1>
          <p className="mt-3 text-muted-foreground">Meet the dedicated individuals driving our mission since 1999.</p>
        </div>
      </FadeUp>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Leadership</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Advisory Board</h3>
          <p className="mt-2 text-muted-foreground">Guiding KSS with wisdom, experience, and vision.</p>
        </FadeUp>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(advisors ?? []).map((m: any, i: number) => <MemberCard key={m.id} m={m} i={i} kind="advisory" />)}
        </div>
      </div>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Governance</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Trustee Board</h3>
          <p className="mt-2 text-muted-foreground">Our founding trustees who uphold our mission and values.</p>
        </FadeUp>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(trustees ?? []).map((m: any, i: number) => <MemberCard key={m.id} m={m} i={i} kind="trustee" />)}
        </div>
      </div>

      <div className="mt-16">
        <FadeUp>
          <SectionLabel>Seva Warriors</SectionLabel>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-bold">Our Dedicated Volunteers</h3>
          <p className="mt-2 text-muted-foreground">650+ volunteers who make our work possible every day.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-6 p-8 rounded-xl border-l-4" style={{ background: "#FFF3EC", borderColor: ORANGE }}>
            <p className="italic text-lg leading-relaxed text-foreground/90">
              "Every volunteer who joins KSS becomes part of a family dedicated to reaching the unreached. Their time, passion, and commitment transform lives every single day."
            </p>
            <p className="mt-4 font-semibold" style={{ color: ORANGE }}>— Prakash Raju, General Secretary, KSS</p>
            <button
              onClick={() => navigate({ to: "/get-involved" })}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105"
              style={{ background: ORANGE }}
            >
              Join as a Volunteer →
            </button>
          </div>
        </FadeUp>
      </div>
    </motion.section>
  );
}
