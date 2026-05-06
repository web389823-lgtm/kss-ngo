import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Heart, Eye, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About — Keshava Seva Samiti" },
    { name: "description", content: "Founded in 2007, KSS is dedicated to social service across India through education, healthcare and empowerment." },
  ]}),
});

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About KSS" title="A movement of seva, rooted in dharma." description="Keshava Seva Samiti began in 2007 as a small group of volunteers determined to bring dignity, education and care to those most in need. Today we serve thousands across India." />
      <section className="container-page py-16 grid md:grid-cols-3 gap-5">
        <Card className="p-7"><Target className="h-6 w-6 text-primary mb-3" /><h3 className="font-serif text-xl font-semibold">Our Mission</h3><p className="mt-2 text-sm text-muted-foreground">Empower vulnerable communities through education, healthcare, women empowerment and welfare programs that uphold dignity.</p></Card>
        <Card className="p-7"><Eye className="h-6 w-6 text-primary mb-3" /><h3 className="font-serif text-xl font-semibold">Our Vision</h3><p className="mt-2 text-sm text-muted-foreground">A society where every child learns, every woman is empowered and every family lives with health and hope.</p></Card>
        <Card className="p-7"><Heart className="h-6 w-6 text-primary mb-3" /><h3 className="font-serif text-xl font-semibold">Our Values</h3><p className="mt-2 text-sm text-muted-foreground">Selfless service, transparency, community-led action, cultural rootedness and unwavering commitment to dharma.</p></Card>
      </section>
      <section className="container-page py-12 max-w-3xl">
        <h2 className="font-serif text-3xl font-semibold mb-6">Our story</h2>
        <div className="prose prose-neutral dark:prose-invert text-muted-foreground space-y-4 text-base leading-relaxed">
          <p>What began as a single tutoring centre in a Bengaluru slum has grown into a multi-program organisation working across education, healthcare, women empowerment and welfare. Our 650+ active volunteers and dedicated team carry forward the original mission every day.</p>
          <p>We believe that real change is community-led. Every program we run is designed in partnership with the people it serves, ensuring relevance, impact and sustainability.</p>
          <p>From running 24 Seva Basti schools to organising 320+ medical camps and empowering over 4,200 women, the work is far from done. With your support, we keep going.</p>
        </div>
      </section>
    </>
  );
}
