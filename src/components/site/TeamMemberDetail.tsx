import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";

const ORANGE = "#E05A1C";

type Kind = "advisory" | "trustee";

export default function TeamMemberDetail({ kind }: { kind: Kind }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug ?? "";
  const table = kind === "advisory" ? "advisory_team" : "trusted_members";
  const label = kind === "advisory" ? "ADVISORY BOARD MEMBER" : "TRUSTEE BOARD MEMBER";

  const { data: members, isLoading } = useQuery({
    queryKey: [table, "all"],
    queryFn: async () => (await supabase.from(table).select("*").order("sort_order")).data ?? [],
  });

  const member: any = (members ?? []).find(
    (m: any) => (m.slug && m.slug === slug) || slugify(m.name) === slug,
  );

  if (isLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!member) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Member not found.</p>
        <button
          onClick={() => navigate({ to: "/about" })}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold"
          style={{ borderColor: ORANGE, color: ORANGE }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to About
        </button>
      </div>
    );
  }

  const subtitle = member.position ?? member.role;
  const description = member.full_bio ?? member.bio ?? member.description;
  const initials = (member.name ?? "")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const expertise: string[] = member.expertise
    ? String(member.expertise).split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="container-page py-12 md:py-16">
      <button
        onClick={() => navigate({ to: "/about" })}
        className="inline-flex items-center gap-2 font-semibold mb-8 hover:opacity-80 transition"
        style={{ color: ORANGE }}
      >
        <ArrowLeft className="h-4 w-4" /> Back to About
      </button>

      <div className="grid md:grid-cols-[400px_1fr] gap-10 md:gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-full object-cover shadow-lg"
              style={{ maxWidth: 400, height: 480, borderRadius: 20 }}
            />
          ) : (
            <div
              className="flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                maxWidth: 400,
                width: "100%",
                height: 480,
                borderRadius: 20,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                fontSize: "4rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <p
            className="text-xs font-bold uppercase"
            style={{ color: ORANGE, letterSpacing: "0.2em" }}
          >
            {label}
          </p>
          <h1 className="mt-2 font-serif font-extrabold" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
            {member.name}
          </h1>
          {subtitle && (
            <p className="mt-1 font-semibold" style={{ color: ORANGE, fontSize: "1.1rem" }}>
              {subtitle}
            </p>
          )}

          <div className="my-5 h-px" style={{ background: ORANGE, opacity: 0.4 }} />

          {member.association_since && (
            <p className="text-sm text-muted-foreground">
              Associated with KSS since {member.association_since}
            </p>
          )}

          {expertise.length > 0 && (
            <div className="mt-5">
              <p className="font-bold text-sm mb-2">Area of Expertise:</p>
              <div className="flex flex-wrap gap-2">
                {expertise.map((e) => (
                  <span
                    key={e}
                    className="px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: "#FFF3EC", color: ORANGE, border: `1px solid ${ORANGE}` }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {description && (
            <div className="mt-7">
              <h2 className="font-serif text-xl font-bold mb-3">About {member.name}</h2>
              <p
                className="whitespace-pre-line"
                style={{ lineHeight: 1.9, fontSize: "1rem", color: "#374151" }}
              >
                {description}
              </p>
            </div>
          )}

          {member.qualifications && (
            <div className="mt-6">
              <h2 className="font-serif text-xl font-bold mb-2">Qualifications</h2>
              <p className="text-muted-foreground whitespace-pre-line">{member.qualifications}</p>
            </div>
          )}

          {member.message && (
            <blockquote
              className="mt-7 p-5 italic"
              style={{ borderLeft: `4px solid ${ORANGE}`, background: "#FFF8F3" }}
            >
              <p className="text-foreground/90">{member.message}</p>
              <p className="mt-3 text-right font-semibold" style={{ color: ORANGE }}>
                — {member.name}
              </p>
            </blockquote>
          )}

          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
              style={{ background: "#0a66c2" }}
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          )}
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate({ to: "/about", hash: "team" })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 font-semibold transition hover:scale-105"
          style={{ borderColor: ORANGE, color: ORANGE }}
        >
          <ArrowLeft className="h-4 w-4" /> View All Team Members
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
