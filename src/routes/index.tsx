import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Heart, HandHeart, Sparkles, GraduationCap, Home as HomeIcon, Stethoscope, Users, Award, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import hero from "@/assets/hero-children.jpg";
import healthCamp from "@/assets/health-camp.jpg";
import womenWorkshop from "@/assets/women-workshop.jpg";
import groceryDrive from "@/assets/grocery-drive.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Keshava Seva Samiti — Service to Humanity" },
      { name: "description", content: "Serving India's most vulnerable through education, healthcare, women empowerment and welfare. Donate or volunteer with KSS today." },
    ],
  }),
});

const ICONS: Record<string, any> = { GraduationCap, Home: HomeIcon, Stethoscope, Sparkles, Users, Award };

function HomePage() {
  const { data: stats } = useQuery({
    queryKey: ["impact_stats"],
    queryFn: async () => (await supabase.from("impact_stats").select("*").order("sort_order")).data ?? [],
  });
  const { data: programs } = useQuery({
    queryKey: ["programs", "home"],
    queryFn: async () => (await supabase.from("programs").select("*").eq("status", "active").order("sort_order").limit(6)).data ?? [],
  });
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials", "featured"],
    queryFn: async () => (await supabase.from("testimonials").select("*").eq("is_featured", true).limit(3)).data ?? [],
  });
  const { data: posts } = useQuery({
    queryKey: ["blog", "home"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3)).data ?? [],
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Non-profit · Since 2007</p>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.05] text-balance">
              Service is the rent <br />we pay for living.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Keshava Seva Samiti has been serving communities across India for over 18 years — in education, healthcare, women empowerment and welfare.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/donate"><Heart className="mr-2 h-4 w-4" />Donate Now</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/get-involved"><HandHeart className="mr-2 h-4 w-4" />Become a Volunteer</Link></Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-serif text-2xl text-foreground font-semibold">12K+</span><br />Students helped</div>
              <div className="h-10 w-px bg-border" />
              <div><span className="font-serif text-2xl text-foreground font-semibold">8.5K+</span><br />Families supported</div>
              <div className="h-10 w-px bg-border" />
              <div><span className="font-serif text-2xl text-foreground font-semibold">650+</span><br />Volunteers</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-saffron opacity-20 blur-2xl" />
            <img src={hero} alt="Children at a KSS Seva Basti school" width={1600} height={1100}
              className="relative rounded-2xl shadow-elevated object-cover aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="container-page py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Impact</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Numbers that tell our story</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(stats ?? []).map((s: any) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <Card key={s.id} className="p-6 text-center shadow-soft hover:shadow-elevated transition-shadow">
                <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="font-serif text-3xl font-semibold">{s.value.toLocaleString()}{s.suffix}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Programs that transform lives</h2>
            </div>
            <Button asChild variant="ghost"><Link to="/programs">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(programs ?? []).map((p: any, i: number) => (
              <Card key={p.id} className="overflow-hidden p-0 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5">
                <div className="aspect-[16/9] gradient-saffron relative overflow-hidden">
                  <img src={[healthCamp, womenWorkshop, groceryDrive][i % 3]} alt={p.title} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-90" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{p.category}</p>
                  <h3 className="mt-2 font-serif text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DONATE / VOLUNTEER CTAS */}
      <section className="container-page py-20 grid md:grid-cols-2 gap-6">
        <Card className="p-10 gradient-saffron text-primary-foreground border-0 shadow-elevated">
          <Heart className="h-8 w-8 mb-4" />
          <h3 className="font-serif text-2xl md:text-3xl font-semibold">Your donation creates ripples</h3>
          <p className="mt-3 opacity-95">Every rupee directly funds education, healthcare and welfare. 80G eligible.</p>
          <Button asChild variant="secondary" className="mt-6"><Link to="/donate">Donate now <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </Card>
        <Card className="p-10 shadow-soft border-2">
          <HandHeart className="h-8 w-8 mb-4 text-primary" />
          <h3 className="font-serif text-2xl md:text-3xl font-semibold">Give your time</h3>
          <p className="mt-3 text-muted-foreground">Join 650+ volunteers serving communities across India.</p>
          <Button asChild className="mt-6"><Link to="/get-involved">Get involved <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </Card>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Voices</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Stories from those we serve</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {(testimonials ?? []).map((t: any) => (
              <Card key={t.id} className="p-7 shadow-soft">
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-4 text-sm leading-relaxed">"{t.content}"</p>
                <div className="mt-6">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Latest</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">News & updates</h2>
          </div>
          <Button asChild variant="ghost"><Link to="/blog">All news <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(posts ?? []).map((p: any) => (
            <Card key={p.id} className="p-6 shadow-soft hover:shadow-elevated transition-shadow">
              <p className="text-xs uppercase tracking-wider text-primary">{p.category}</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
