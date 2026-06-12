import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import React from "react";
import {
  Target, Eye, Heart, Users, Home, Calendar, UserCheck,
  CheckCircle2, Mail, Phone, MapPin, Clock, Image as ImageIcon, UsersRound, ArrowRight,
} from "lucide-react";
import FadeUp from "@/components/FadeUp";
import AnimatedNumber from "@/components/AnimatedNumber";
import FadeImage from "@/components/FadeImage";
import aboutSeva from "@/assets/about-seva.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About — Keshava Seva Samiti" },
    { name: "description", content: "Since 1999, KSS has served lakhs across India through education, healthcare, women empowerment and welfare." },
  ]}),
});

const ORANGE = "#ea580c";
const PARTNERS = [
  "Seva Bharati", "Rotary Club", "Senior Citizen Welfare Association", "Govt. Ayush Hospital",
  "Q Hospitals", "ALE India Pvt. Ltd.", "Fidelity Services", "Bhima Jewellers",
  "Ultra Green Pvt. Ltd.", "Globe Eye Foundation", "Mouna Guru Swami Mutt", "Good Measure Foundation",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase" style={{ color: ORANGE, letterSpacing: "0.25em" }}>
      {children}
    </p>
  );
}

function ExploreCards() {
  const navigate = useNavigate();
  const cards = [
    { icon: Clock, title: "Milestones", desc: "Our journey since 1999 — key moments that shaped KSS.", to: "/milestones" },
    { icon: ImageIcon, title: "Gallery", desc: "Photos and moments of seva from our programs and events.", to: "/gallery" },
    { icon: UsersRound, title: "Our Members", desc: "Advisors, trustees and volunteers behind KSS.", to: "/team" },
  ];
  return (
    <section className="container-page py-20">
      <FadeUp>
        <div className="text-center mb-10">
          <SectionLabel>Explore More</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">Dive Deeper Into Our Story</h2>
        </div>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <FadeUp key={c.title} delay={i * 0.1}>
            <motion.button
              type="button"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => navigate({ to: c.to })}
              className="w-full text-left bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-transparent hover:border-orange-200"
            >
              <div className="h-12 w-12 rounded-full grid place-items-center mb-5 transition-transform group-hover:scale-110" style={{ background: "#FFF3EC" }}>
                <c.icon className="h-6 w-6" style={{ color: ORANGE }} />
              </div>
              <h3 className="font-serif text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-1" style={{ color: ORANGE }}>
                View <ArrowRight className="h-4 w-4" />
              </p>
            </motion.button>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Hero />
      <Intro />
      <MVV />
      <Impact />
      <Story />
      <Certifications />
      <Partners />
      <ExploreCards />
      <ContactStrip />
    </motion.div>
  );
}



function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDF8F3 0%, #FFF8F0 100%)" }}>
      <div className="container-page py-20 md:py-28 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionLabel>About KSS</SectionLabel>
          <h1 className="mt-5 font-serif font-extrabold tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.15 }}>
            A Movement of Seva, Rooted in Dharma
          </h1>
          <p className="mt-6 mx-auto max-w-2xl" style={{ color: "#4b5563", fontSize: "1.15rem", lineHeight: 1.7 }}>
            Keshava Seva Samiti began in 1999 as a small group of volunteers determined to bring dignity, education, and care to those most in need. Today we serve thousands across India.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="container-page py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <FadeImage src={aboutSeva} alt="KSS volunteers serving the community" className="w-full h-[420px] object-cover" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel>Who We Are</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold leading-tight">
            25 Years of Unwavering Commitment to Service
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>Keshava Seva Samiti (KSS) is a charitable trust dedicated to uplifting families in seva basathis for over 25 years. Our mission is to integrate them into mainstream society through cultural and social initiatives.</p>
            <p>KSS focuses on education, healthcare, women's empowerment, and cultural education. With a strong commitment to social development we have impacted 14.88 lakh beneficiaries through various programs, fostering empowerment and better living conditions.</p>
            <p>We work primarily across North and Central Bengaluru, operating nearly 150 community centres across 65+ locations covering 72 constituencies.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MVV() {
  const cards = [
    { icon: Target, title: "Our Mission", text: "To integrate underprivileged communities into the mainstream through education, healthcare, women empowerment, and welfare programs that uphold dignity." },
    { icon: Eye, title: "Our Vision", text: "A society where every child learns, every woman is empowered, and every family lives with health, dignity, and hope." },
    { icon: Heart, title: "Our Values", text: "Selfless service, transparency, community-led action, cultural rootedness, and unwavering commitment to dharma." },
  ];
  return (
    <section className="container-page pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <FadeUp key={c.title} delay={i * 0.1}>
            <motion.div whileHover={{ y: -6 }} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow h-full">
              <c.icon className="h-8 w-8 mb-4" style={{ color: ORANGE }} />
              <h3 className="font-serif text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const stats = [
    { icon: Users, value: 1488000, label: "Beneficiaries", suffix: "+", display: (n: number) => `${(n / 100000).toFixed(2)} Lakh+` },
    { icon: Home, value: 150, label: "Seva Basathis", suffix: "" },
    { icon: Calendar, value: 25, label: "Years of Service", suffix: "+" },
    { icon: UserCheck, value: 650, label: "Active Volunteers", suffix: "+" },
  ];
  return (
    <section style={{ background: "#FFF3EC" }} className="py-20">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <s.icon className="h-7 w-7 mx-auto mb-3" style={{ color: ORANGE }} />
                <div className="font-serif text-3xl md:text-4xl font-extrabold" style={{ color: "#1a1a1a" }}>
                  {s.label === "Beneficiaries" ? (
                    <><AnimatedNumber value={14.88} decimals={2} /> Lakh+</>
                  ) : (
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const paragraphs = [
    "What began as a single tutoring centre in a Bengaluru slum has grown into a multi-program organisation working across education, healthcare, women empowerment and more. Our 650+ active volunteers and dedicated team carry forward the original mission every day.",
    "We believe that real change is community-led. Every program we run is designed in partnership with the people it serves, ensuring relevance, impact, and sustainability.",
    "From running 24 Seva Basti schools to organising 320+ medical camps and empowering over 4,000 women, the work is far from done. With your support, we keep going.",
  ];
  return (
    <section className="container-page py-20 max-w-3xl">
      <FadeUp>
        <SectionLabel>Our Story</SectionLabel>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">From a Single Tuition Centre to a Movement</h2>
      </FadeUp>
      <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
        {paragraphs.map((p, i) => (
          <FadeUp key={i} delay={i * 0.1}><p>{p}</p></FadeUp>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const certs = [
    { name: "80G Certified", desc: "Donations are eligible for full tax exemption under Section 80G of the Income Tax Act." },
    { name: "12A Registered", desc: "Income is exempted from tax under the Income Tax Act." },
    { name: "10A Approved", desc: "Ensures compliance under the new NGO tax regime." },
  ];
  return (
    <section style={{ background: "#f5f5f5" }} className="py-20">
      <div className="container-page grid md:grid-cols-3 gap-5">
        {certs.map((c, i) => (
          <FadeUp key={c.name} delay={i * 0.1}>
            <div className="bg-white rounded-xl p-7 shadow-sm h-full">
              <CheckCircle2 className="h-8 w-8 mb-4" style={{ color: "#16a34a" }} />
              <h3 className="font-bold text-lg">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="container-page py-20 text-center">
      <FadeUp>
        <SectionLabel>Our Partners</SectionLabel>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold">Organizations We Work With</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">KSS works in partnership with leading organizations to maximize impact.</p>
      </FadeUp>
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {PARTNERS.map((p) => (
          <motion.span
            key={p}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="px-5 py-2 rounded-full border bg-white text-sm font-medium transition-colors duration-200 cursor-default"
            style={{ borderColor: ORANGE, color: ORANGE }}
            whileHover={{ backgroundColor: ORANGE, color: "#fff" }}
          >
            {p}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}


function ContactStrip() {
  const navigate = useNavigate();
  return (
    <section style={{ background: "#1a1a1a" }} className="text-white py-16">
      <div className="container-page grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-serif text-2xl font-bold">Get in Touch</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3"><Mail className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="mailto:kss.seva@gmail.com" className="hover:underline">kss.seva@gmail.com</a></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="tel:+919845487509" className="hover:underline">+91-9845487509</a></li>
            <li className="flex items-start gap-3"><Phone className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><a href="tel:+919900288341" className="hover:underline">+91-9900288341</a></li>
            <li className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: ORANGE }} /><span>No.237, 2nd Cross Road, Pai Layout, Mahadevapura, Bengaluru, Karnataka 560016</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold">Support Our Work</h3>
          <div className="mt-5 space-y-2 text-sm text-white/85">
            <p><span className="text-white/60">Account Name:</span> Keshava Seva Samiti</p>
            <p><span className="text-white/60">Bank:</span> Union Bank</p>
            <p><span className="text-white/60">Account No:</span> 520101226076152</p>
            <p><span className="text-white/60">IFSC:</span> UBIN0533114</p>
          </div>
          <button
            onClick={() => navigate({ to: "/donate" })}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105"
            style={{ background: ORANGE }}
          >
            Donate Now →
          </button>
        </div>
      </div>
    </section>
  );
}
