import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Award, Target } from "lucide-react";
import csrImg from "@/assets/get-involved-csr.png";

export const Route = createFileRoute("/get-involved/csr")({
  component: CsrInfoPage,
  head: () => ({ meta: [
    { title: "CSR Partnership — Keshava Seva Samiti" },
    { name: "description", content: "Partner with KSS for measurable CSR impact in education, healthcare, women empowerment and more." },
  ]}),
});

const SPONSOR_PROGRAMS = [
  "Vidya Bhagya tuition center sponsorship",
  "Scholarship sponsorships for girls",
  "Health & eye camp sponsorships",
  "Women vocational training support",
];

const SPONSOR_PROJECTS = [
  "School infrastructure development",
  "Smart classroom setup",
  "RO water systems",
  "Science laboratory setup",
  "School library development",
];

const BUDGET_TIERS = [
  { tier: "Under ₹5 Lakh", desc: "Fund a summer camp (Bala Karanji) or scholarship for 1 girl." },
  { tier: "₹5–25 Lakh", desc: "Sponsor a tuition center, health camp series, or women's vocational batch." },
  { tier: "₹25–50 Lakh", desc: "School infrastructure package or annual sports event (Bala Sangama)." },
  { tier: "₹50 Lakh – 1 Crore", desc: "Multi-year program support, school rehabilitation." },
  { tier: "Above ₹1 Crore", desc: "Comprehensive annual support, multiple programs, branded facilities." },
];

const RECOGNITION = [
  "Logo placement on uniforms, kits and printed materials",
  "Recognition in annual reports, press releases and digital media",
  "Joint press conferences and project inaugurations",
  "Customized impact reports with case studies",
  "Participation in student felicitation events",
  "Employee volunteering opportunities",
];

const SDG = [
  "Promotion of education (SDG 4)",
  "Healthcare and preventive health (SDG 3)",
  "Women's empowerment (SDG 5)",
  "Environmental sustainability (SDG 13)",
  "Eradicating poverty and hunger (SDG 1)",
  "Reduced inequalities (SDG 10)",
];

function CsrInfoPage() {
  return (
    <>
      <div className="container-page pt-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/get-involved"><ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved</Link>
        </Button>
      </div>

      <PageHeader
        eyebrow="Corporate Social Responsibility"
        title="Partner with KSS through CSR"
        description="Align your CSR mandate with measurable, on-ground impact across education, healthcare and women empowerment."
      />

      <section className="container-page py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in lg:order-2">
          <img src={csrImg} alt="CSR partnership with KSS" className="w-full rounded-xl shadow-soft object-cover max-h-[440px]" />
        </div>
        <div className="animate-fade-in lg:order-1">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Why Partner</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-4">Schedule VII compliant. Transparent. Measurable.</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            With 25 years of grassroots delivery and 14.88 lakh beneficiaries, KSS co-designs CSR programs
            that meet statutory compliance and deliver on-ground outcomes. Every rupee comes with a transparent
            impact report — case studies, data and photos.
          </p>
          <Button asChild size="lg" className="transition-transform hover:scale-[1.02]">
            <Link to="/get-involved/csr/register">
              Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-12 grid md:grid-cols-2 gap-6">
        <Card className="p-8 shadow-soft">
          <div className="flex items-center gap-2 text-primary mb-3"><Target className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-wider">Sponsor a Program</span></div>
          <p className="text-sm text-muted-foreground mb-4">₹53,350 – ₹4,95,000+ annually per program</p>
          <ul className="space-y-2">
            {SPONSOR_PROGRAMS.map((s) => <li key={s} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" /><span>{s}</span></li>)}
          </ul>
        </Card>
        <Card className="p-8 shadow-soft">
          <div className="flex items-center gap-2 text-primary mb-3"><Target className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-wider">Sponsor a Project</span></div>
          <p className="text-sm text-muted-foreground mb-4">₹1,00,000 – ₹10,00,000+</p>
          <ul className="space-y-2">
            {SPONSOR_PROJECTS.map((s) => <li key={s} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" /><span>{s}</span></li>)}
          </ul>
        </Card>
      </section>

      <section className="container-page py-12">
        <Card className="p-8 md:p-10 shadow-soft">
          <h3 className="font-serif text-2xl font-semibold mb-6">Budget-specific opportunities</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {BUDGET_TIERS.map((b) => (
              <div key={b.tier} className="border rounded-lg p-4 hover:shadow-soft transition-all">
                <p className="font-semibold text-primary">{b.tier}</p>
                <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="container-page py-12 grid md:grid-cols-2 gap-6">
        <Card className="p-8 shadow-soft">
          <div className="flex items-center gap-2 text-primary mb-4"><Award className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-wider">Branding & Recognition</span></div>
          <ul className="space-y-2">
            {RECOGNITION.map((s) => <li key={s} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" /><span>{s}</span></li>)}
          </ul>
        </Card>
        <Card className="p-8 shadow-soft">
          <div className="flex items-center gap-2 text-primary mb-4"><Target className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-wider">Schedule VII / SDG Alignment</span></div>
          <ul className="space-y-2">
            {SDG.map((s) => <li key={s} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" /><span>{s}</span></li>)}
          </ul>
        </Card>
      </section>

      <section className="container-page py-12">
        <Card className="p-10 text-center shadow-soft bg-secondary/30">
          <h3 className="font-serif text-2xl font-semibold mb-3">Ready to partner with KSS?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Share your organisation's details and our partnerships team will respond within 5 working days.</p>
          <Button asChild size="lg" className="transition-transform hover:scale-[1.02]">
            <Link to="/get-involved/csr/register">
              Register for CSR Partnership <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
