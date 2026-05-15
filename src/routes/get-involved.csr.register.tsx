import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { ArrowLeft, CheckCircle2, Building2 } from "lucide-react";

function BackBtn() {
  return (
    <div className="container-page pt-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/get-involved"><ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved</Link>
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/get-involved/csr/register")({
  component: CsrPage,
  head: () => ({ meta: [
    { title: "CSR Partnership Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register your organisation to partner with KSS on impactful CSR initiatives." },
  ]}),
});

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];
const FOCUS = ["Education","Health","Women Empowerment","Food Security","Environment","Cultural Preservation","General"];
const BUDGETS = ["Below ₹5 Lakh","₹5–25 Lakh","₹25–50 Lakh","₹50 Lakh–1 Crore","Above ₹1 Crore"];

const schema = z.object({
  company: z.string().trim().min(2).max(200),
  company_pan: z.string().trim().min(5).max(20),
  company_tan: z.string().trim().max(20).optional().or(z.literal("")),
  full_name: z.string().trim().min(2).max(150),
  designation: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(1).max(500),
  state: z.string().min(1),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  budget_range: z.string().min(1),
  focus_areas: z.string().min(1),
  message: z.string().trim().min(1).max(2000),
});

function CsrPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => navigate({ to: "/get-involved" }), 3000);
    return () => clearTimeout(t);
  }, [submitted, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setSubmitting(true);
    const payload: any = { ...parsed.data, purpose: parsed.data.focus_areas };
    Object.keys(payload).forEach((k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]);
    const { error } = await supabase.from("csr_applications").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    toast.success("Inquiry submitted!");
  }

  if (submitted) {
    return (
      <>
        <BackBtn />
        <PageHeader eyebrow="Thank you" title="Inquiry received" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft animate-fade-in">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">Thank you for your interest</h2>
            <p className="mt-3 text-muted-foreground">
              Our partnerships team will contact you within <strong className="text-foreground">2–5 working days</strong> to discuss your CSR mandate and shape a measurable program together.
            </p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <BackBtn />
      <PageHeader eyebrow="CSR Partnership" title="Partner with KSS" description="Share your organisation's details — our partnerships team will be in touch." />
      <section className="container-page py-16 max-w-3xl">
        <Card className="p-8 shadow-soft animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Label htmlFor="company">Company Name *</Label><Input id="company" name="company" required /></div>
              <div><Label htmlFor="company_pan">Company PAN *</Label><Input id="company_pan" name="company_pan" required /></div>
              <div><Label htmlFor="company_tan">Company TAN</Label><Input id="company_tan" name="company_tan" /></div>
              <div><Label htmlFor="full_name">Contact Person *</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="designation">Designation *</Label><Input id="designation" name="designation" required /></div>
              <div><Label htmlFor="email">Official Email *</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
              <div className="md:col-span-2"><Label htmlFor="address">Company Address *</Label><Textarea id="address" name="address" rows={2} required /></div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select name="state" required>
                  <SelectTrigger id="state"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent className="max-h-72">{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="city">City</Label><Input id="city" name="city" /></div>
              <div>
                <Label htmlFor="budget_range">CSR Budget Range *</Label>
                <Select name="budget_range" required>
                  <SelectTrigger id="budget_range"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="focus_areas">Area of CSR Focus *</Label>
                <Select name="focus_areas" required>
                  <SelectTrigger id="focus_areas"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{FOCUS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label htmlFor="message">Message / Proposal *</Label><Textarea id="message" name="message" rows={5} required /></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full transition-transform hover:scale-[1.01]">
              <Building2 className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Inquiry"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
