import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, HandHeart, Building2, Info } from "lucide-react";
import volunteerImg from "@/assets/get-involved-volunteer.png";
import csrImg from "@/assets/get-involved-csr.png";
import { RegistrationForms } from "@/components/site/RegistrationForms";

export const Route = createFileRoute("/get-involved")({
  component: GetInvolvedPage,
  head: () => ({ meta: [
    { title: "Get Involved — Keshava Seva Samiti" },
    { name: "description", content: "Volunteer your time or partner with KSS through CSR collaborations to drive real social change." },
  ]}),
});

function GetInvolvedPage() {
  return (
    <>
      <PageHeader eyebrow="Get Involved" title="Be the change with KSS" description="Join us as a volunteer or partner with us through CSR — together we build stronger communities." />
      <section className="container-page py-16 space-y-10">

        {/* Volunteer */}
        <Card className="overflow-hidden grid md:grid-cols-2 gap-0 hover:shadow-elegant transition-all animate-fade-in">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <HandHeart className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Volunteer</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold mb-3">Become a Volunteer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your time, skills, and passion can make a lasting difference. Volunteer with KSS and be the
              reason someone smiles today. Together, we build stronger communities and a brighter,
              more compassionate future for all.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#register">Register as Volunteer <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link to="/get-involved/volunteer-info"><Info className="mr-2 h-4 w-4" />View More Information</Link>
              </Button>
            </div>
          </div>
          <div className="bg-secondary/30 flex items-center justify-center p-6">
            <img src={volunteerImg} alt="Volunteer with KSS" className="max-h-80 w-full object-cover rounded-lg" />
          </div>
        </Card>

        {/* CSR */}
        <Card className="overflow-hidden grid md:grid-cols-2 gap-0 hover:shadow-elegant transition-all animate-fade-in">
          <div className="bg-secondary/30 flex items-center justify-center p-6 md:order-2">
            <img src={csrImg} alt="CSR partnership with KSS" className="max-h-80 w-full object-cover rounded-lg" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center md:order-1">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Corporate Social Responsibility</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold mb-3">Partner with KSS through CSR</h2>
            <p className="text-muted-foreground leading-relaxed">
              Align your organisation's CSR mandate with measurable, on-ground impact across education,
              healthcare, women empowerment, and environmental sustainability. Our team co-designs
              programs, ensures full statutory compliance, and delivers transparent impact reporting
              for every rupee invested.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/get-involved/csr">Register for CSR Partnership <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link to="/get-involved/csr-info"><Info className="mr-2 h-4 w-4" />View More Information</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
