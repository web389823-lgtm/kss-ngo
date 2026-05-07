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
import { toast } from "sonner";
import { CheckCircle2, Building2 } from "lucide-react";

export const Route = createFileRoute("/get-involved/csr")({
  component: CsrPage,
  head: () => ({ meta: [
    { title: "CSR Partnership — Keshava Seva Samiti" },
    { name: "description", content: "Partner with KSS through impactful CSR collaborations across education, health, and women empowerment." },
  ]}),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function CsrPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("company") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const merged = company ? `Company: ${company}\n\n${message}` : message;
    const parsed = schema.safeParse({
      full_name: fd.get("full_name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      message: merged,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setSubmitting(true);
    const payload: any = { ...parsed.data, area_of_interest: "CSR Partnership", availability: "CSR" };
    Object.keys(payload).forEach((k) => payload[k] === "" && delete payload[k]);
    const { error } = await supabase.from("volunteers").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    toast.success("Thank you! Our partnerships team will be in touch.");
  }

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Thank you" title="We'll be in touch" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">Inquiry received</h2>
            <p className="mt-3 text-muted-foreground">Our partnerships team will reach out within 3–5 days to discuss collaboration opportunities.</p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="CSR" title="Partner with KSS" description="Drive measurable social change through CSR collaborations." />
      <section className="container-page py-16 max-w-3xl">
        <Card className="p-8 shadow-soft">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label htmlFor="full_name">Contact Name *</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="company">Company / Organization</Label><Input id="company" name="company" /></div>
              <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
              <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} /></div>
              <div className="md:col-span-2"><Label htmlFor="message">Tell us about your CSR goals</Label><Textarea id="message" name="message" rows={4} /></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <Building2 className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Inquiry"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
