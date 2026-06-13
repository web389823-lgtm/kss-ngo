import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Globe, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Keshava Seva Samiti" },
      { name: "description", content: "Get in touch with Keshava Seva Samiti. Address, phone, email and direct contact form." },
      { property: "og:title", content: "Contact — Keshava Seva Samiti" },
      { property: "og:description", content: "Get in touch with KSS — Bengaluru-based NGO serving since 1999." },
    ],
  }),
});

const schema = z.object({
  first_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(2000),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions" as any).insert({
      first_name: parsed.data.first_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.subject,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Message received. We'll be in touch soon.");
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch with KSS" description="We'd love to hear from you — about volunteering, partnerships, donations, or anything else." />
      <section className="container-page py-16 grid lg:grid-cols-[1fr_360px] gap-8">
        <Card className="p-8 shadow-soft">
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-semibold">Message received</h2>
              <p className="mt-3 text-muted-foreground">Our team will respond within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div><Label htmlFor="first_name">Name *</Label><Input id="first_name" name="first_name" required /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
                <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
              </div>
              <div><Label htmlFor="subject">Subject *</Label><Input id="subject" name="subject" required /></div>
              <div><Label htmlFor="message">Message *</Label><Textarea id="message" name="message" rows={6} required /></div>
              <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </Card>
        <aside className="space-y-4">
          <Card className="p-6 shadow-soft">
            <h3 className="font-serif text-lg font-semibold mb-4">Reach us directly</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>No.237, 2nd Cross Road, Pai Layout, Mahadevapura, Bengaluru, Karnataka 560016</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href="mailto:kss.seva@gmail.com" className="hover:underline">kss.seva@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:+919845487509" className="hover:underline">+91-9845487509</a>
                  <a href="tel:+919900288341" className="hover:underline">+91-9900288341</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>www.kss.ngo</span>
              </li>
            </ul>
          </Card>
          <Card className="p-6 shadow-soft bg-accent/40">
            <h3 className="font-serif text-lg font-semibold">Certifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">80G Certified · 12A Registered · 10A Approved</p>
          </Card>
        </aside>
      </section>
    </>
  );
}
