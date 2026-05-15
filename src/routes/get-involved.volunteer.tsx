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
import { ArrowLeft, ArrowRight, CheckCircle2, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/get-involved/volunteer")({
  component: VolunteerRegisterPage,
  head: () => ({ meta: [
    { title: "Volunteer Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register as a KSS volunteer." },
  ]}),
});

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];
const EDUCATION = ["Below 10th","10th Pass","12th Pass","Graduate","Post Graduate","PhD","Professional Degree","Other"];
const INTERESTS = ["Education & Teaching","Healthcare Support","Food Distribution","Women Empowerment","Cultural Programs","Community Outreach","Event Management","Administration","Social Media & Communications","Other"];
const AVAILABILITY = ["Weekdays","Weekends","Both Weekdays & Weekends","Flexible"];
const HOURS = ["Less than 4 hours","4–8 hours","8–16 hours","More than 16 hours"];
const MODES = ["On-ground only","Remote only","Both on-ground and remote"];
const SOURCES = ["Social Media","Friend or Family","Event","Website","Other"];
const GENDERS = ["Male","Female","Other","Prefer not to say"];

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(100),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(18, "Must be 18+").max(80, "Must be 80 or less"),
  gender: z.string().min(1, "Select gender"),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  state: z.string().min(1, "Select state"),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  education: z.string().min(1, "Select education"),
  aadhaar: z.string().trim().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  pan: z.string().trim().max(10).optional().or(z.literal("")),
  occupation: z.string().trim().max(100).optional().or(z.literal("")),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  area_of_interest: z.string().min(1, "Select primary area"),
  secondary_interest: z.string().optional().or(z.literal("")),
  availability: z.string().min(1, "Select availability"),
  hours_per_week: z.string().min(1, "Select hours per week"),
  mode: z.string().min(1, "Select mode"),
  languages: z.string().trim().max(200).optional().or(z.literal("")),
  special_skills: z.string().trim().max(500).optional().or(z.literal("")),
  why_volunteer: z.string().trim().min(20, "Please write at least 20 characters"),
  source: z.string().optional().or(z.literal("")),
  declaration: z.literal("on", { errorMap: () => ({ message: "You must accept the declaration" }) }),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function VolunteerRegisterPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  // controlled values for selects
  const [sel, setSel] = useState<Record<string, string>>({});
  const setS = (k: string, v: string) => setSel((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const obj: Record<string, any> = Object.fromEntries(fd.entries());
    // merge controlled selects
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
      occupation: d.occupation || null,
      organization: d.organization || null,
      secondary_interest: d.secondary_interest || null,
      hours_per_week: d.hours_per_week,
      mode: d.mode,
      languages: d.languages || null,
      special_skills: d.special_skills || null,
      source: d.source || null,
      why_volunteer: d.why_volunteer,
    };
    const message = `Why: ${d.why_volunteer}\n\n--- Additional ---\n${JSON.stringify(extra, null, 2)}`;
    const payload = {
      full_name: d.full_name,
      age: d.age,
      gender: d.gender,
      email: d.email,
      phone: d.phone,
      state: d.state,
      city: d.city || null,
      address: d.address || null,
      education: d.education,
      aadhaar: d.aadhaar,
      pan: d.pan || null,
      area_of_interest: d.area_of_interest,
      availability: d.availability,
      purpose: d.area_of_interest,
      message,
    };
    const { error } = await supabase.from("volunteers").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application submitted!");
    setSubmitted({ name: d.full_name, email: d.email, phone: d.phone });
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
            <h2 className="font-serif text-3xl font-semibold">Application Submitted Successfully!</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Thank you <strong className="text-foreground">{submitted.name}</strong>! Your volunteer application has been received.
              Our team will review it and reach out to you at <strong className="text-foreground">{submitted.email}</strong> or
              <strong className="text-foreground"> {submitted.phone}</strong> within 5 business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline">
                <Link to="/get-involved"><ArrowLeft className="mr-2 h-4 w-4" />Back to Get Involved</Link>
              </Button>
              <Button asChild>
                <Link to="/programs">View Programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
      <PageHeader eyebrow="Volunteer" title="Volunteer Registration Form" description="Fill in your details below. Fields marked * are required." />
      <section className="container-page py-8 max-w-3xl">
        <p className="mb-6 text-sm text-muted-foreground">
          Want to know more before registering?{" "}
          <Link to="/get-involved/volunteer-info" className="text-primary underline hover:no-underline">View volunteer information</Link>
        </p>

        <Card className="p-8 shadow-soft animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-8" noValidate>
            {/* Personal Details */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label htmlFor="full_name">Full Name *</Label><Input id="full_name" name="full_name" className={errCls("full_name")} /><FieldErr msg={errors.full_name} /></div>
                <div><Label htmlFor="age">Age *</Label><Input id="age" name="age" type="number" min={18} max={80} className={errCls("age")} /><FieldErr msg={errors.age} /></div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={sel.gender} onValueChange={(v) => setS("gender", v)}>
                    <SelectTrigger id="gender" className={errCls("gender")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.gender} />
                </div>
                <div><Label htmlFor="email">Email ID *</Label><Input id="email" name="email" type="email" className={errCls("email")} /><FieldErr msg={errors.email} /></div>
                <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" inputMode="numeric" maxLength={10} placeholder="10 digits" className={errCls("phone")} /><FieldErr msg={errors.phone} /></div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={sel.state} onValueChange={(v) => setS("state", v)}>
                    <SelectTrigger id="state" className={errCls("state")}><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent className="max-h-72">{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.state} />
                </div>
                <div><Label htmlFor="city">City / Area</Label><Input id="city" name="city" /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} /></div>
              </div>
            </div>

            {/* Education & Identity */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Education & Identity</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Highest Education *</Label>
                  <Select value={sel.education} onValueChange={(v) => setS("education", v)}>
                    <SelectTrigger id="education" className={errCls("education")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{EDUCATION.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.education} />
                </div>
                <div><Label htmlFor="aadhaar">Aadhaar Number *</Label><Input id="aadhaar" name="aadhaar" inputMode="numeric" maxLength={12} placeholder="12 digits" className={errCls("aadhaar")} /><FieldErr msg={errors.aadhaar} /></div>
                <div><Label htmlFor="pan">PAN Number</Label><Input id="pan" name="pan" maxLength={10} placeholder="ABCDE1234F" /></div>
                <div><Label htmlFor="occupation">Occupation</Label><Input id="occupation" name="occupation" placeholder="Student, Teacher, Doctor…" /></div>
                <div className="md:col-span-2"><Label htmlFor="organization">Organization / Institute</Label><Input id="organization" name="organization" placeholder="Current employer or college" /></div>
              </div>
            </div>

            {/* Volunteering Preferences */}
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Volunteering Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area_of_interest">Primary Area of Interest *</Label>
                  <Select value={sel.area_of_interest} onValueChange={(v) => setS("area_of_interest", v)}>
                    <SelectTrigger id="area_of_interest" className={errCls("area_of_interest")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{INTERESTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.area_of_interest} />
                </div>
                <div>
                  <Label htmlFor="secondary_interest">Secondary Area of Interest</Label>
                  <Select value={sel.secondary_interest} onValueChange={(v) => setS("secondary_interest", v)}>
                    <SelectTrigger id="secondary_interest"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{INTERESTS.map((s) => <SelectItem key={`s-${s}`} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Select value={sel.availability} onValueChange={(v) => setS("availability", v)}>
                    <SelectTrigger id="availability" className={errCls("availability")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{AVAILABILITY.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.availability} />
                </div>
                <div>
                  <Label htmlFor="hours_per_week">Hours per Week *</Label>
                  <Select value={sel.hours_per_week} onValueChange={(v) => setS("hours_per_week", v)}>
                    <SelectTrigger id="hours_per_week" className={errCls("hours_per_week")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{HOURS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.hours_per_week} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="mode">Mode of Volunteering *</Label>
                  <Select value={sel.mode} onValueChange={(v) => setS("mode", v)}>
                    <SelectTrigger id="mode" className={errCls("mode")}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{MODES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FieldErr msg={errors.mode} />
                </div>
                <div className="md:col-span-2"><Label htmlFor="languages">Languages Known</Label><Input id="languages" name="languages" placeholder="e.g. Kannada, Hindi, English" /></div>
                <div className="md:col-span-2"><Label htmlFor="special_skills">Special Skills</Label><Textarea id="special_skills" name="special_skills" rows={2} placeholder="Any skills relevant to volunteering" /></div>
                <div className="md:col-span-2">
                  <Label htmlFor="why_volunteer">Why do you want to volunteer with KSS? *</Label>
                  <Textarea id="why_volunteer" name="why_volunteer" rows={4} className={errCls("why_volunteer")} placeholder="Tell us in at least 20 characters" />
                  <FieldErr msg={errors.why_volunteer} />
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
                I confirm that all information provided is accurate and I agree to abide by the KSS code of conduct as a volunteer. *
              </Label>
            </div>
            <FieldErr msg={errors.declaration} />

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <HandHeart className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Volunteer Application"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
