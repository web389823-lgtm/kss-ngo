import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/get-involved/csr")({
  component: CsrRegisterPage,
  head: () => ({ meta: [
    { title: "CSR Partnership Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register your company's CSR interest with KSS." },
  ]}),
});

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];
const COMPANY_TYPES = ["Private Limited","Public Limited","LLP","Partnership","Proprietorship","Government PSU","Other"];
const EMPLOYEES = ["Less than 50","50–200","200–500","500–1000","More than 1000"];
const BUDGETS = ["Below ₹5 Lakh","₹5–25 Lakh","₹25–50 Lakh","₹50 Lakh–1 Crore","Above ₹1 Crore","Prefer not to disclose"];
const FOCUS = ["Education","Health","Women Empowerment","Food Security","Environment","Cultural Preservation","General","Multiple Areas"];
const PROGRAMS = ["Vidya Bhagya (Tuition Centers)","Vidya Vahini (Scholarships)","Arogya Bhagya (Health Camps)","Nari Uttejan (Women Empowerment)","Bala Sangama (Annual Event)","Smart Classroom","Emergency Relief","Vessel Bank (Zero-Waste)","Medical Equipment Center","Open to Suggestions"];
const PREV = ["First time","1–2 years","3–5 years","More than 5 years"];
const SOURCES = ["Social Media","Event","Partner Organization","Google Search","Referral","Other"];

const schema = z.object({
  company: z.string().trim().min(2, "Company name is required").max(200),
  company_type: z.string().min(1, "Select company type"),
  company_pan: z.string().trim().regex(/^[A-Z0-9]{10}$/, "PAN must be 10 uppercase characters"),
  company_tan: z.string().trim().max(20).optional().or(z.literal("")),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().trim().min(1, "Address is required").max(500),
  state: z.string().min(1, "Select state"),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  pin_code: z.string().trim().regex(/^\d{6}$/, "PIN must be 6 digits").optional().or(z.literal("")),
  employees: z.string().optional().or(z.literal("")),
  full_name: z.string().trim().min(2, "Contact name is required").max(150),
  designation: z.string().trim().min(1, "Designation is required").max(150),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be 10 digits"),
  alternate_phone: z.string().trim().regex(/^\d{10}$/, "Must be 10 digits").optional().or(z.literal("")),
  linkedin: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  budget_range: z.string().min(1, "Select budget range"),
  focus_areas: z.string().min(1, "Select primary focus"),
  secondary_focus: z.string().optional().or(z.literal("")),
  preferred_program: z.string().optional().or(z.literal("")),
  prev_csr_experience: z.string().optional().or(z.literal("")),
  message: z.string().trim().min(30, "Please write at least 30 characters").max(2000),
  source: z.string().optional().or(z.literal("")),
  declaration: z.literal("on", { errorMap: () => ({ message: "You must accept the declaration" }) }),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function CsrRegisterPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<{ company: string; contact: string; email: string; phone: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sel, setSel] = useState<Record<string, string>>({});
  const setS = (k: string, v: string) => setSel((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const obj: Record<string, any> = Object.fromEntries(fd.entries());
    if (typeof obj.company_pan === "string") obj.company_pan = obj.company_pan.toUpperCase();
    Object.assign(obj, sel);
    const parsed = schema.safeParse(obj);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as keyof Errors] = i.message; });
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    const d = parsed.data;
    const extra = {
      company_type: d.company_type,
      website: d.website || null,
      pin_code: d.pin_code || null,
      employees: d.employees || null,
      alternate_phone: d.alternate_phone || null,
      linkedin: d.linkedin || null,
      secondary_focus: d.secondary_focus || null,
      preferred_program: d.preferred_program || null,
      prev_csr_experience: d.prev_csr_experience || null,
      source: d.source || null,
    };
    const fullMessage = `${d.message}\n\n--- Additional ---\n${JSON.stringify(extra, null, 2)}`;
    const payload = {
      company: d.company,
      company_pan: d.company_pan,
      company_tan: d.company_tan || null,
      full_name: d.full_name,
      designation: d.designation,
      email: d.email,
      phone: d.phone,
      address: d.address,
      state: d.state,
      city: d.city || null,
      budget_range: d.budget_range,
      focus_areas: d.focus_areas,
      purpose: d.focus_areas,
      message: fullMessage,
    };
    const { error } = await supabase.from("csr_applications").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Proposal submitted!");
    setSubmitted({ company: d.company, contact: d.full_name, email: d.email, phone: d.phone });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <>
        <div className="container-page pt-6">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/get-involved" })}>
            <ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved
          </Button>
        </div>
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-semibold">Proposal Submitted Successfully!</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Thank you <strong className="text-foreground">{submitted.company}</strong>! Your CSR partnership proposal has been received.
              Our team will review it and contact <strong className="text-foreground">{submitted.contact}</strong> at
              <strong className="text-foreground"> {submitted.email}</strong> or
              <strong className="text-foreground"> {submitted.phone}</strong> within 5 business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline">
                <Link to="/get-involved"><ArrowLeft className="mr-2 h-4 w-4" />Back to Get Involved</Link>
              </Button>
              <Button asChild>
                <Link to="/programs">View Our Programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>
        </section>
      </>
    );
  }

  const errCls = (k: keyof Errors) => errors[k] ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <>
      <div className="container-page pt-6">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/get-involved" })}>
          <ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved
        </Button>
      </div>
      <PageHeader eyebrow="CSR Partnership" title="CSR Partnership Registration" description="Register your company's CSR interest. Our team will reach out within 5 business days." />
      <section className="container-page py-8 max-w-3xl">
        <p className="mb-6 text-sm text-muted-foreground">
          Want to learn more before registering?{" "}
          <Link to="/get-involved/csr-info" className="text-primary underline hover:no-underline">View CSR partnership information</Link>
        </p>

        <Card className="p-8 shadow-soft animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-8" noValidate>
            {/* Company Information */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label htmlFor="company">Company Name *</Label><Input id="company" name="company" className={errCls("company")} /><FieldErr msg={errors.company} /></div>
                <div>
                  <Label htmlFor="company_type">Company Type *</Label>
                  <Select value={sel.company_type} onValueChange={(v) => setS("company_type", v)}>
                    <SelectTrigger id="company_type" className={errCls("company_type")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{COMPANY_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.company_type} />
                </div>
                <div><Label htmlFor="company_pan">Company PAN *</Label><Input id="company_pan" name="company_pan" maxLength={10} placeholder="AAAAA1234A" className={cn("uppercase", errCls("company_pan"))} /><FieldErr msg={errors.company_pan} /></div>
                <div><Label htmlFor="company_tan">Company TAN</Label><Input id="company_tan" name="company_tan" /></div>
                <div><Label htmlFor="website">Company Website</Label><Input id="website" name="website" type="url" placeholder="https://" className={errCls("website")} /><FieldErr msg={errors.website} /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Company Address *</Label><Textarea id="address" name="address" rows={2} className={errCls("address")} /><FieldErr msg={errors.address} /></div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={sel.state} onValueChange={(v) => setS("state", v)}>
                    <SelectTrigger id="state" className={errCls("state")}><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent className="max-h-72">{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.state} />
                </div>
                <div><Label htmlFor="city">City</Label><Input id="city" name="city" /></div>
                <div><Label htmlFor="pin_code">PIN Code</Label><Input id="pin_code" name="pin_code" inputMode="numeric" maxLength={6} className={errCls("pin_code")} /><FieldErr msg={errors.pin_code} /></div>
                <div>
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Select value={sel.employees} onValueChange={(v) => setS("employees", v)}>
                    <SelectTrigger id="employees"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{EMPLOYEES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Contact Person Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label htmlFor="full_name">Contact Person Full Name *</Label><Input id="full_name" name="full_name" className={errCls("full_name")} /><FieldErr msg={errors.full_name} /></div>
                <div><Label htmlFor="designation">Designation *</Label><Input id="designation" name="designation" placeholder="CSR Manager, Director…" className={errCls("designation")} /><FieldErr msg={errors.designation} /></div>
                <div><Label htmlFor="email">Official Email ID *</Label><Input id="email" name="email" type="email" className={errCls("email")} /><FieldErr msg={errors.email} /></div>
                <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" inputMode="numeric" maxLength={10} placeholder="10 digits" className={errCls("phone")} /><FieldErr msg={errors.phone} /></div>
                <div><Label htmlFor="alternate_phone">Alternate Phone</Label><Input id="alternate_phone" name="alternate_phone" inputMode="numeric" maxLength={10} className={errCls("alternate_phone")} /><FieldErr msg={errors.alternate_phone} /></div>
                <div><Label htmlFor="linkedin">LinkedIn Profile</Label><Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className={errCls("linkedin")} /><FieldErr msg={errors.linkedin} /></div>
              </div>
            </div>

            {/* CSR Intent */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">CSR Intent</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_range">CSR Budget Range *</Label>
                  <Select value={sel.budget_range} onValueChange={(v) => setS("budget_range", v)}>
                    <SelectTrigger id="budget_range" className={errCls("budget_range")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.budget_range} />
                </div>
                <div>
                  <Label htmlFor="focus_areas">Primary CSR Focus Area *</Label>
                  <Select value={sel.focus_areas} onValueChange={(v) => setS("focus_areas", v)}>
                    <SelectTrigger id="focus_areas" className={errCls("focus_areas")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{FOCUS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.focus_areas} />
                </div>
                <div>
                  <Label htmlFor="secondary_focus">Secondary CSR Focus Area</Label>
                  <Select value={sel.secondary_focus} onValueChange={(v) => setS("secondary_focus", v)}>
                    <SelectTrigger id="secondary_focus"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{FOCUS.map((f) => <SelectItem key={`s-${f}`} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferred_program">Preferred Program to Support</Label>
                  <Select value={sel.preferred_program} onValueChange={(v) => setS("preferred_program", v)}>
                    <SelectTrigger id="preferred_program"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{PROGRAMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="prev_csr_experience">Previous CSR Experience</Label>
                  <Select value={sel.prev_csr_experience} onValueChange={(v) => setS("prev_csr_experience", v)}>
                    <SelectTrigger id="prev_csr_experience"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{PREV.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="message">Message / Proposal *</Label>
                  <Textarea id="message" name="message" rows={5} className={errCls("message")} placeholder="Describe how KSS aligns with your company mandate (min 30 characters)" />
                  <FieldErr msg={errors.message} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="source">How did you hear about KSS?</Label>
                  <Select value={sel.source} onValueChange={(v) => setS("source", v)}>
                    <SelectTrigger id="source"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className={cn("flex items-start gap-3 p-4 rounded-lg border", errors.declaration && "border-destructive bg-destructive/5")}>
              <Checkbox id="declaration" name="declaration" />
              <Label htmlFor="declaration" className="text-sm font-normal leading-relaxed cursor-pointer">
                I confirm that the information provided is accurate and I am authorized to submit this CSR partnership inquiry on behalf of my organization. *
              </Label>
            </div>
            <FieldErr msg={errors.declaration} />

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <Building2 className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit CSR Partnership Proposal"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
