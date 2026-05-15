import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, HandHeart, CheckCircle2 } from "lucide-react";
import volunteerImg from "@/assets/get-involved-volunteer.png";

export const Route = createFileRoute("/get-involved/volunteer")({
  component: VolunteerInfoPage,
  head: () => ({ meta: [
    { title: "Become a Volunteer — Keshava Seva Samiti" },
    { name: "description", content: "Join KSS as a volunteer. Teach, mentor, support healthcare camps and uplift communities." },
  ]}),
});

const OPPORTUNITIES = [
  "Teachers for tuition centers (Vidya Bhagya)",
  "Counselors for exam stress programs",
  "Sports instructors for youth programs",
  "Health camp support staff",
  "Event coordinators for Bala Sangama",
  "Cultural program facilitators",
  "Administrative support",
  "Social media & digital marketing",
  "Community outreach coordinators",
];

function VolunteerInfoPage() {
  return (
    <>
      <div className="container-page pt-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/get-involved"><ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved</Link>
        </Button>
      </div>

      <PageHeader eyebrow="Volunteer" title="Become a Volunteer" description="Your time, skills and passion can change lives. Join 650+ KSS changemakers." />

      <section className="container-page py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in">
          <img src={volunteerImg} alt="Volunteer with KSS" className="w-full rounded-xl shadow-soft object-cover max-h-[440px]" />
        </div>
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <HandHeart className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Why Volunteer</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-4">Be the reason someone smiles today</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            For 25 years, KSS has reached the unreached — educating children, empowering women, and
            delivering healthcare to slum communities. Volunteers are the heart of every program.
            Whether you can give a few hours a week or full-time skills, there's a place for you.
          </p>
          <Button asChild size="lg" className="transition-transform hover:scale-[1.02]">
            <Link to="/get-involved/volunteer/register">
              Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-12">
        <Card className="p-8 md:p-10 shadow-soft">
          <h3 className="font-serif text-2xl font-semibold mb-6">Volunteer Opportunities</h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {OPPORTUNITIES.map((o) => (
              <li key={o} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/get-involved/volunteer/register">
                Register as Volunteer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}
