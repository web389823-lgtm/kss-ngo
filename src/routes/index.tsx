import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Heart, HandHeart, Sparkles, GraduationCap, Home as HomeIcon,
  Stethoscope, Users, Award, Quote, BookOpen, Drama, Baby, Flower2,
  Phone, Mail, MapPin, Target, Eye, Handshake, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/site/Counter";
import MissionTagline from "@/components/site/MissionTagline";
import ProgramPhotoGrid from "@/components/site/ProgramPhotoGrid";

const DEFAULT_HERO_SLIDES = [
  "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1600",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600",
  "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=1600",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600",
  "https://images.unsplash.com/photo-1578496479932-143f47d35c09?w=1600",
];

function HeroSlideshow({ slides }: { slides: string[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n]);
  if (n === 0) return null;
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-screen overflow-hidden bg-black">
      {slides.map((src, idx) => (
        <img
          key={src + idx}
          src={src}
          alt=""
          aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setI((x) => (x - 1 + n) % n)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setI((x) => (x + 1) % n)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

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
  // Advisory/Trustee sections removed from home page — they live on /about

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
      {/* HERO — fullscreen image slideshow */}
      <HeroSlideshow slides={Array.isArray(heroCfg.slides) && heroCfg.slides.length > 0 ? heroCfg.slides : DEFAULT_HERO_SLIDES} />


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
              <Link key={p.id} to="/programs/$slug" params={{ slug: p.slug }} className="group">
                <Card className="overflow-hidden p-0 h-full shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5">
                  <div className="aspect-[16/9] gradient-saffron relative overflow-hidden">
                    <img src={p.banner_url || p.thumbnail_url || [healthCamp, womenWorkshop, groceryDrive][i % 3]} alt={p.title} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">{p.category}</p>
                    <h3 className="mt-2 font-serif text-xl font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                  </div>
                </Card>
              </Link>
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

      {/* Advisory & Trustee Board sections removed — see /about */}


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
