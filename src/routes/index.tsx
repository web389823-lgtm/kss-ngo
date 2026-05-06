import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Heart, HandHeart, Sparkles, GraduationCap, Home as HomeIcon,
  Stethoscope, Users, Award, Quote, BookOpen, Drama, Baby, Flower2,
  Phone, Mail, MapPin, Target, Eye, Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/site/Counter";
import hero from "@/assets/hero-children.jpg";
import healthCamp from "@/assets/health-camp.jpg";
import womenWorkshop from "@/assets/women-workshop.jpg";
import groceryDrive from "@/assets/grocery-drive.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Keshava Seva Samiti — Transforming lives since 1999" },
      { name: "description", content: "Bengaluru-based NGO serving marginalized communities through education, healthcare, women empowerment, culture and welfare. Donate or volunteer with KSS today." },
    ],
  }),
});

const ICONS: Record<string, any> = { GraduationCap, Home: HomeIcon, Stethoscope, Sparkles, Users, Award };

const PROGRAM_HIGHLIGHTS = [
  { icon: GraduationCap, title: "Education", body: "Education forms the core of KSS's work — academic support, access to essentials, guidance and encouragement for children to continue their learning journey with confidence. Equal emphasis on cultural grounding, discipline and character building." },
  { icon: Flower2, title: "Women Empowerment", body: "KSS supports women through skill development, livelihood opportunities and community-based initiatives. Programs also promote health awareness, hygiene, environmental responsibility and civic participation." },
  { icon: Drama, title: "Culture & Values", body: "KSS integrates Bharatiya values into its initiatives through camps, activities and events that promote teamwork, leadership and social harmony." },
  { icon: Baby, title: "BalaSangam", body: "Our flagship annual children's event, bringing together thousands of children to celebrate sports, creativity and learning while building confidence and discipline." },
  { icon: Sparkles, title: "Yoga Day", body: "KSS celebrates International Yoga Day through large-scale community participation — promoting physical health, mental well-being and awareness of yoga as a way of life." },
  { icon: BookOpen, title: "Seva Bastis", body: "Nearly 100 community centres across 65+ locations and 12 constituencies bring education, healthcare and care to where it is needed most." },
];

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
  const { data: advisory } = useQuery({
    queryKey: ["advisory_team", "home"],
    queryFn: async () => (await supabase.from("advisory_team").select("*").order("sort_order")).data ?? [],
  });
  const { data: trustees } = useQuery({
    queryKey: ["trusted_members", "home"],
    queryFn: async () => (await supabase.from("trusted_members").select("*").order("sort_order")).data ?? [],
  });
  const { data: settings } = useQuery({
    queryKey: ["site_settings_home"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["home_hero", "home_about", "home_mission_vision", "home_contact"]);
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value));
      return map;
    },
  });

  const heroCfg = settings?.home_hero ?? {};
  const about = settings?.home_about ?? {};
  const mv = settings?.home_mission_vision ?? {};
  const contact = settings?.home_contact ?? {};

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24 animate-fade-in">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">{heroCfg.eyebrow ?? "Non-profit · Since 1999"}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance">
              {heroCfg.headline ?? "Keshava Seva Samiti has been transforming lives since 1999"}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {heroCfg.subtext ?? "Serving marginalized communities with dedication, compassion, and purpose."}
            </p>
            <p className="mt-4 max-w-xl text-base font-medium bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              {heroCfg.tagline ?? "Seva for lasting change, sustainable impact, and empowered communities"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/donate"><Heart className="mr-2 h-4 w-4" />Donate Now</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/get-involved"><HandHeart className="mr-2 h-4 w-4" />Become a Volunteer</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-saffron opacity-20 blur-2xl" />
            <img src={hero} alt="Children at a KSS Seva Basti school" width={1600} height={1100}
              className="relative rounded-2xl shadow-elevated object-cover aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img src={womenWorkshop} alt="KSS women's workshop" className="rounded-2xl shadow-elevated object-cover aspect-[4/3] w-full" loading="lazy" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About Us</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">{about.title ?? "About Keshava Seva Samiti"}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{about.p1}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{about.p2}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">{about.p3}</p>
            <Button asChild variant="outline" className="mt-6"><Link to="/about">Learn more <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* IMPACT — animated counters */}
      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Impact</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Numbers that tell our story</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(stats ?? []).map((s: any) => {
              const Icon = ICONS[s.icon] ?? Sparkles;
              return (
                <Card key={s.id} className="p-6 text-center shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                  <div className="font-serif text-xl md:text-2xl lg:text-[1.6rem] font-semibold tracking-tight tabular-nums break-words">
                    <Counter to={s.value} suffix={s.suffix ?? ""} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="container-page py-20 grid md:grid-cols-2 gap-6">
        <Card className="p-8 shadow-soft border-l-4 border-primary">
          <Target className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-serif text-2xl font-semibold">Our Mission</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{mv.mission}</p>
        </Card>
        <Card className="p-8 shadow-soft border-l-4 border-amber-500">
          <Eye className="h-8 w-8 text-amber-600 mb-4" />
          <h3 className="font-serif text-2xl font-semibold">Our Vision</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{mv.vision}</p>
        </Card>
      </section>

      {/* PROGRAM HIGHLIGHTS */}
      <section className="bg-muted/30 py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What We Do</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Program highlights</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROGRAM_HIGHLIGHTS.map((p) => (
              <Card key={p.title} className="p-7 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                <div className="grid h-12 w-12 place-items-center rounded-full gradient-saffron text-primary-foreground mb-4">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline"><Link to="/programs">View all programs <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* PROGRAMS FROM DB */}
      {(programs ?? []).length > 0 && (
        <section className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Programs</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Active initiatives</h2>
            </div>
            <Button asChild variant="ghost"><Link to="/programs">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(programs ?? []).map((p: any, i: number) => (
              <Card key={p.id} className="overflow-hidden p-0 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5">
                <div className="aspect-[16/9] gradient-saffron relative overflow-hidden">
                  <img src={p.banner_url || [healthCamp, womenWorkshop, groceryDrive][i % 3]} alt={p.title} loading="lazy"
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
        </section>
      )}

      {/* WHY DONATE */}
      <section className="bg-muted/30 py-20">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Donate</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Every contribution creates ripples</h2>
            <p className="mt-5 text-muted-foreground">Your support directly funds the work that transforms lives across Bengaluru and beyond.</p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: GraduationCap, label: "Education for children" },
                { icon: Stethoscope, label: "Healthcare for communities" },
                { icon: HomeIcon, label: "Food and essential supplies" },
                { icon: Flower2, label: "Women empowerment programs" },
              ].map((i) => (
                <li key={i.label} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                    <i.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{i.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">Your support helps build a stronger, self-reliant society.</p>
            <Button asChild size="lg" className="mt-6"><Link to="/donate"><Heart className="mr-2 h-4 w-4" />Donate Now</Link></Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-saffron opacity-20 blur-2xl" />
            <img src={groceryDrive} alt="Ration kit distribution" className="relative rounded-2xl shadow-elevated object-cover aspect-[4/3] w-full" loading="lazy" />
          </div>
        </div>
      </section>

      {/* GET INVOLVED */}
      <section className="container-page py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get Involved</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Be a part of meaningful change</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: HandHeart, title: "Volunteer with us", body: "Give your time and skills to communities that need them most.", to: "/get-involved", cta: "Join now" },
            { icon: Heart, title: "Support a program", body: "Fund a Seva Basti, a child's education, or a health camp.", to: "/donate", cta: "Donate" },
            { icon: Handshake, title: "Partner with us", body: "Collaborate on long-term impact through CSR or institutional partnerships.", to: "/get-involved", cta: "Partner" },
          ].map((x) => (
            <Card key={x.title} className="p-7 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
              <div className="grid h-12 w-12 place-items-center rounded-full gradient-saffron text-primary-foreground mb-4">
                <x.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold">{x.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.body}</p>
              <Button asChild variant="ghost" className="mt-3 px-0"><Link to={x.to}>{x.cta} <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </Card>
          ))}
        </div>
      </section>

      {/* NEWS */}
      {(posts ?? []).length > 0 && (
        <section className="bg-muted/30 py-20">
          <div className="container-page">
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
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {(testimonials ?? []).length > 0 && (
        <section className="container-page py-20">
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
        </section>
      )}

      {/* ADVISORY BOARD */}
      {(advisory ?? []).length > 0 && (
        <section className="bg-muted/30 py-20">
          <div className="container-page">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Leadership</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Advisory Board</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {(advisory ?? []).map((m: any) => (
                <Link
                  key={m.id}
                  to="/team/$type/$id"
                  params={{ type: "advisory", id: m.id }}
                  className="group text-center"
                >
                  <div className="mx-auto mb-4 h-40 w-40 md:h-44 md:w-44 rounded-full gradient-saffron overflow-hidden ring-4 ring-background shadow-elevated transition-transform group-hover:scale-105">
                    {m.photo_url && <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="font-semibold group-hover:text-primary transition-colors">{m.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.position}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUSTEE BOARD */}
      {(trustees ?? []).length > 0 && (
        <section className="py-20">
          <div className="container-page">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Governance</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl font-semibold">Trustee Board</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {(trustees ?? []).map((m: any) => (
                <Link
                  key={m.id}
                  to="/team/$type/$id"
                  params={{ type: "trustee", id: m.id }}
                  className="group text-center"
                >
                  <div className="mx-auto mb-4 h-40 w-40 md:h-44 md:w-44 rounded-full gradient-saffron overflow-hidden ring-4 ring-background shadow-elevated transition-transform group-hover:scale-105">
                    {m.photo_url && <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="font-semibold group-hover:text-primary transition-colors">{m.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.role}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="container-page py-20">
        <Card className="overflow-hidden p-0 shadow-elevated border-0">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-12 gradient-saffron text-primary-foreground">
              <h3 className="font-serif text-3xl font-semibold">Have questions or want to collaborate?</h3>
              <p className="mt-3 opacity-95">We'd love to hear from you. Reach out for partnerships, volunteering, or general queries.</p>
              <Button asChild variant="secondary" size="lg" className="mt-6"><Link to="/get-involved">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div className="p-10 md:p-12 bg-card">
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Phone</div><div className="font-medium">{contact.phone}</div></div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div><div className="font-medium">{contact.email}</div></div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Address</div><div className="font-medium">{contact.address}</div></div>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
