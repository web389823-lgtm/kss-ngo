import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, HandHeart, Briefcase, GraduationCap, Laptop, HandHelping } from "lucide-react";

export const Route = createFileRoute("/get-involved/volunteer-info")({
  component: VolunteerInfoPage,
  head: () => ({ meta: [
    { title: "Volunteer Information — Keshava Seva Samiti" },
    { name: "description", content: "Learn about volunteer roles, eligibility and what to expect when you volunteer with KSS." },
  ]}),
});

const WHY = [
  "25+ years of community impact",
  "Work with 14.88 lakh+ beneficiaries",
  "Meaningful ground-level seva work",
  "Certificate of appreciation",
  "Letters of recommendation available",
  "Networking with like-minded changemakers",
];

const ROLES = [
  "Teachers for Vidya Bhagya Tuition Centers",
  "Health Camp Support Staff",
  "Event Coordinators for Bala Sangama",
  "Cultural Program Facilitators",
  "Women Empowerment Trainers",
  "Food Distribution Volunteers",
  "Administrative & Documentation Support",
  "Social Media & Digital Marketing",
  "Community Outreach Workers",
];

const ELIGIBILITY = [
  "Age 18 and above",
  "Any educational background",
  "Commitment of minimum 4 hours per week",
  "Based in or near Bengaluru preferred (remote options available)",
];

const EXPECT = [
  "Orientation session after selection",
  "Assigned to a program based on skills",
  "Monthly volunteer meetups",
  "Impact reports shared quarterly",
];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-8 shadow-soft animate-fade-in">
      <h3 className="font-serif text-2xl font-semibold mb-5">{title}</h3>
      <ul className="grid md:grid-cols-2 gap-3">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const WAYS = [
  { Icon: HandHelping, title: "General Volunteer", body: "Join hands to create real change in communities. Volunteer on weekdays, weekends for a better tomorrow." },
  { Icon: Briefcase, title: "Corporate Volunteer", body: "Empower your team while making a lasting social impact. Drive corporate responsibility with purpose & passion." },
  { Icon: GraduationCap, title: "Student Volunteer", body: "Gain experience. Give back. Grow stronger. Internship & fellowship opportunities." },
  { Icon: Laptop, title: "Virtual Volunteer", body: "Create meaningful impact without leaving your desk. Support causes, mentor people & contribute to projects." },
];

function WaysToVolunteer() {
  return (
    <section style={{ padding: "16px 0 8px" }}>
      <div className="text-center" style={{ marginBottom: "40px" }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Ways to Volunteer</h2>
        <div style={{ width: 60, height: 3, background: "#E8540A", margin: "12px auto 0" }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ maxWidth: 900, margin: "0 auto" }}>
        {WAYS.map(({ Icon, title, body }) => (
          <div key={title} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", borderTop: "3px solid #E8540A" }}>
            <Icon style={{ width: 40, height: 40, color: "#E8540A", marginBottom: 16 }} />
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: "#1a1a1a", fontSize: 18, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontFamily: "Inter, sans-serif", color: "#666", fontSize: 14, lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



function VolunteerInfoPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container-page pt-6">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: ".." as any })}>
          <ArrowLeft className="mr-1 h-4 w-4" />Back
        </Button>
      </div>
      <PageHeader eyebrow="Volunteer" title="Volunteer with KSS" description="Be the reason someone smiles today — join 650+ KSS changemakers." />
      <section className="container-page py-12 space-y-8">
        <WaysToVolunteer />
        <Section title="Why Volunteer with KSS" items={WHY} />
        <Section title="Volunteer Roles Available" items={ROLES} />
        <Section title="Eligibility" items={ELIGIBILITY} />
        <Section title="What to Expect" items={EXPECT} />


        <Button asChild size="lg" className="w-full">
          <Link to="/get-involved/volunteer">
            <HandHeart className="mr-2 h-5 w-5" />Register as Volunteer <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </>
  );
}
