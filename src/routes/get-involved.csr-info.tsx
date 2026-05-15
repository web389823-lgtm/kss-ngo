import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Building2 } from "lucide-react";

export const Route = createFileRoute("/get-involved/csr-info")({
  component: CsrInfoPage,
  head: () => ({ meta: [
    { title: "CSR Information — Keshava Seva Samiti" },
    { name: "description", content: "Partner with KSS through CSR. Learn about budget tiers, SDG alignment, and recognition for partners." },
  ]}),
});

const WHY = [
  "25 years of verified ground-level impact",
  "80G certified — full tax exemption on donations",
  "12A registered NGO",
  "Transparent impact reporting",
  "Schedule VII Companies Act 2013 compliant",
  "UN SDG aligned programs",
];

const SDGS = [
  "SDG 1: No Poverty",
  "SDG 3: Good Health & Well-being",
  "SDG 4: Quality Education",
  "SDG 5: Gender Equality",
  "SDG 8: Decent Work & Economic Growth",
  "SDG 10: Reduced Inequalities",
  "SDG 13: Climate Action",
];

const TIERS = [
  { range: "Below ₹5 Lakh", desc: "Fund a summer camp or scholarship for 1 girl" },
  { range: "₹5–25 Lakh", desc: "Sponsor a tuition center, health camp series, or vocational training batch" },
  { range: "₹25–50 Lakh", desc: "School infrastructure package or annual sports event (Bala Sangama)" },
  { range: "₹50 Lakh–1 Crore", desc: "Multi-year program support, school rehabilitation" },
  { range: "Above ₹1 Crore", desc: "Comprehensive annual support, branded facilities, named programs" },
];

const RECOGNITION = [
  "Logo placement on uniforms, kits, printed materials",
  "Acknowledgment in annual reports, press releases, digital media",
  "Joint press conferences and inauguration ceremonies",
  "Customized impact reports with case studies",
  "Employee volunteering opportunities",
  "Co-branded outreach materials",
  "Field visits for CSR teams",
];

const PROGRAMS = [
  "Vidya Bhagya — ₹53,350 per tuition center",
  "Padavi Uttejan Girls Scholarship — ₹25,000 to ₹1,50,000 per student",
  "Arogya Bhagya Health Camps — ₹37,20,000 annually per location",
  "Bala Sangama Annual Event — ₹5,00,000+",
  "Smart Classroom Setup — ₹2,00,000",
  "Emergency Relief Ration Program — ₹28,80,000 for 80 families",
  "Vessel Bank Zero-Waste — ₹2,00,000",
  "Medical Equipment Center — Contact for budget",
];

function ListSection({ title, items }: { title: string; items: string[] }) {
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

function CsrInfoPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container-page pt-6">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: ".." as any })}>
          <ArrowLeft className="mr-1 h-4 w-4" />Back
        </Button>
      </div>
      <PageHeader eyebrow="CSR Partnership" title="Partner with KSS through CSR" description="Aligned, accountable and impactful — designed for your CSR mandate." />
      <section className="container-page py-12 space-y-8">
        <ListSection title="Why Partner with KSS" items={WHY} />
        <ListSection title="SDG Alignment" items={SDGS} />

        <Card className="p-8 shadow-soft animate-fade-in">
          <h3 className="font-serif text-2xl font-semibold mb-5">What You Can Fund</h3>
          <div className="space-y-4">
            {TIERS.map((t) => (
              <div key={t.range} className="border-l-4 border-primary pl-4 py-2">
                <div className="font-semibold">{t.range}</div>
                <div className="text-muted-foreground">{t.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <ListSection title="Branding & Recognition for Partners" items={RECOGNITION} />
        <ListSection title="Programs Open for CSR" items={PROGRAMS} />

        <Button asChild size="lg" className="w-full">
          <Link to="/get-involved/csr">
            <Building2 className="mr-2 h-5 w-5" />Register for CSR Partnership <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </>
  );
}
