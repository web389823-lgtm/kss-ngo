import { createFileRoute, Link } from "@tanstack/react-router";
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
import { ArrowLeft, CheckCircle2, HandHeart } from "lucide-react";

function BackBtn() {
  return (
    <div className="container-page pt-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/get-involved"><ArrowLeft className="mr-1 h-4 w-4" />Back to Get Involved</Link>
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/get-involved/volunteer")({
  component: VolunteerPage,
  head: () => ({ meta: [
    { title: "Volunteer Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register as a KSS volunteer. Share your details and join 650+ changemakers." },
  ]}),
});

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];
const INTERESTS = ["Education & Teaching","Healthcare Support","Food Distribution","Women Empowerment","Cultural Programs","Community Outreach","Event Management","Administration","Social Media & Communications"];
const EDUCATION = ["Below 10th","10th","12th","Graduate","Post Graduate","Other"];

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  age: z.coerce.number().int().min(10).max(120),
  gender: z.string().min(1),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  state: z.string().min(1),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  education: z.string().min(1),
  aadhaar: z.string().trim().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  pan: z.string().trim().max(20).optional().or(z.literal("")),
  area_of_interest: z.string().min(1),
  availability: z.string().min(1),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check the form"); return; }
    setSubmitting(true);
    const payload: any = { ...parsed.data, purpose: parsed.data.area_of_interest };
    Object.keys(payload).forEach((k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]);
    const { error } = await supabase.from("volunteers").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    toast.success("Application submitted!");
  }

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Thank you" title="Application received" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft animate-fade-in">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">We've received your details</h2>
            <p className="mt-3 text-muted-foreground">
              Our team will reach out within <strong className="text-foreground">2–5 working days</strong> to confirm your onboarding.
            </p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Volunteer" title="Volunteer Registration" description="Fill in your details — our team will reach out to onboard you." />
      <section className="container-page py-16 max-w-3xl">
        <Card className="p-8 shadow-soft animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Label htmlFor="full_name">Full Name *</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="age">Age *</Label><Input id="age" name="age" type="number" min={10} max={120} required /></div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem><SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select name="state" required>
                  <SelectTrigger id="state"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent className="max-h-72">{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="city">City / Area</Label><Input id="city" name="city" /></div>
              <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} /></div>
              <div>
                <Label htmlFor="education">Highest Qualification *</Label>
                <Select name="education" required>
                  <SelectTrigger id="education"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{EDUCATION.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="aadhaar">Aadhaar Number *</Label><Input id="aadhaar" name="aadhaar" placeholder="12 digits" required maxLength={12} /></div>
              <div><Label htmlFor="pan">PAN (optional)</Label><Input id="pan" name="pan" placeholder="ABCDE1234F" /></div>
              <div>
                <Label htmlFor="area_of_interest">Area of Interest *</Label>
                <Select name="area_of_interest" required>
                  <SelectTrigger id="area_of_interest"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{INTERESTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select name="availability" required>
                  <SelectTrigger id="availability"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekdays">Weekdays</SelectItem><SelectItem value="Weekends">Weekends</SelectItem><SelectItem value="Both">Both</SelectItem><SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label htmlFor="message">Special skills or message</Label><Textarea id="message" name="message" rows={3} /></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full transition-transform hover:scale-[1.01]">
              <HandHeart className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Registration"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
