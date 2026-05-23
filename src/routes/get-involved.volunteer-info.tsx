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
