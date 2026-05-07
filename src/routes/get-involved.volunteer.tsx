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
import { CheckCircle2, HandHeart } from "lucide-react";

export const Route = createFileRoute("/get-involved/volunteer")({
  component: VolunteerPage,
  head: () => ({ meta: [
    { title: "Volunteer Registration — Keshava Seva Samiti" },
    { name: "description", content: "Register as a KSS volunteer. Share your details and join 650+ changemakers." },
  ]}),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  age: z.coerce.number().int().min(0).max(120).optional().or(z.nan()),
  pan: z.string().trim().max(20).optional().or(z.literal("")),
  aadhaar: z.string().trim().max(20).optional().or(z.literal("")),
  purpose: z.string().trim().min(1).max(500),
  area_of_interest: z.string().min(1).max(100),
  availability: z.string().min(1).max(100),
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
    const payload: any = { ...parsed.data };
    if (!payload.age || Number.isNaN(payload.age)) delete payload.age;
    Object.keys(payload).forEach((k) => payload[k] === "" && delete payload[k]);
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
              Our team will review your registration and get back to you within
              <strong className="text-foreground"> 2–5 working days</strong> to confirm your onboarding.
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
              <div><Label htmlFor="full_name">Full Name *</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
              <div className="md:col-span-2"><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
              <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} /></div>
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
              <div><Label htmlFor="pan">PAN</Label><Input id="pan" name="pan" placeholder="ABCDE1234F" /></div>
              <div><Label htmlFor="aadhaar">Aadhaar</Label><Input id="aadhaar" name="aadhaar" placeholder="XXXX XXXX XXXX" /></div>
              <div className="md:col-span-2"><Label htmlFor="purpose">Purpose / Why do you want to volunteer? *</Label><Textarea id="purpose" name="purpose" rows={3} required /></div>
              <div>
                <Label htmlFor="area_of_interest">Area of Interest *</Label>
                <Select name="area_of_interest" required>
                  <SelectTrigger id="area_of_interest"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Education">Education</SelectItem><SelectItem value="Healthcare">Healthcare</SelectItem><SelectItem value="Women Empowerment">Women Empowerment</SelectItem><SelectItem value="Welfare">Welfare</SelectItem><SelectItem value="Events">Events</SelectItem><SelectItem value="Fundraising">Fundraising</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select name="availability" required>
                  <SelectTrigger id="availability"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekends">Weekends</SelectItem><SelectItem value="Weekdays">Weekdays</SelectItem><SelectItem value="Few hours/week">Few hours / week</SelectItem><SelectItem value="Full time">Full time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label htmlFor="message">Anything else?</Label><Textarea id="message" name="message" rows={3} /></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <HandHeart className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Registration"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
