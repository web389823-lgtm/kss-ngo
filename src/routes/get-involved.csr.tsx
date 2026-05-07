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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Building2 } from "lucide-react";

export const Route = createFileRoute("/get-involved/csr")({
  component: CsrPage,
  head: () => ({ meta: [
    { title: "CSR Partnership Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register your organisation to partner with KSS on impactful CSR initiatives." },
  ]}),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(150),
  designation: z.string().trim().max(150).optional().or(z.literal("")),
  company: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  gender: z.string().optional().or(z.literal("")),
  age: z.coerce.number().int().min(0).max(120).optional().or(z.nan()),
  pan: z.string().trim().max(20).optional().or(z.literal("")),
  aadhaar: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  purpose: z.string().trim().min(1).max(1000),
  budget_range: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function CsrPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setSubmitting(true);
    const payload: any = { ...parsed.data };
    if (!payload.age || Number.isNaN(payload.age)) delete payload.age;
    Object.keys(payload).forEach((k) => payload[k] === "" && delete payload[k]);
    const { error } = await supabase.from("csr_applications").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    toast.success("Inquiry submitted!");
  }

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Thank you" title="Inquiry received" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft animate-fade-in">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">We've received your CSR inquiry</h2>
            <p className="mt-3 text-muted-foreground">
              Our partnerships team will review your details and get back to you within
              <strong className="text-foreground"> 2–5 working days</strong> to discuss collaboration opportunities.
            </p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="CSR Partnership" title="CSR Registration" description="Share your organisation's details — our partnerships team will be in touch." />
      <section className="container-page py-16 max-w-3xl">
        <Card className="p-8 shadow-soft animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label htmlFor="full_name">Contact Person *</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="designation">Designation</Label><Input id="designation" name="designation" placeholder="CSR Head, Director…" /></div>
              <div className="md:col-span-2"><Label htmlFor="company">Company / Organisation *</Label><Input id="company" name="company" required /></div>
              <div><Label htmlFor="email">Official Email *</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                  <SelectTrigger id="gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" min={0} max={120} /></div>
              <div><Label htmlFor="pan">PAN (Company / Individual)</Label><Input id="pan" name="pan" placeholder="ABCDE1234F" /></div>
              <div><Label htmlFor="aadhaar">Aadhaar</Label><Input id="aadhaar" name="aadhaar" placeholder="XXXX XXXX XXXX" /></div>
              <div className="md:col-span-2"><Label htmlFor="address">Registered Address</Label><Textarea id="address" name="address" rows={2} /></div>
              <div className="md:col-span-2"><Label htmlFor="purpose">Purpose of Partnership *</Label><Textarea id="purpose" name="purpose" rows={3} required placeholder="Education, healthcare, women empowerment, environment…" /></div>
              <div className="md:col-span-2">
                <Label htmlFor="budget_range">Indicative CSR Budget</Label>
                <Select name="budget_range">
                  <SelectTrigger id="budget_range"><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< 5 Lakh">Below ₹5 Lakh</SelectItem>
                    <SelectItem value="5-25 Lakh">₹5 – 25 Lakh</SelectItem>
                    <SelectItem value="25 Lakh - 1 Cr">₹25 Lakh – 1 Crore</SelectItem>
                    <SelectItem value="1 Cr+">₹1 Crore +</SelectItem>
                    <SelectItem value="To be discussed">To be discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label htmlFor="message">Additional Notes</Label><Textarea id="message" name="message" rows={3} /></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <Building2 className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit CSR Inquiry"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
