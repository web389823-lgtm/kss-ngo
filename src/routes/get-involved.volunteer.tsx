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
    { title: "Volunteer — Keshava Seva Samiti" },
    { name: "description", content: "Join 650+ KSS volunteers serving communities across India in education, healthcare and welfare." },
  ]}),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  age: z.coerce.number().int().min(0).max(120).optional().or(z.nan()),
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
    toast.success("Thank you! We'll be in touch.");
  }

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Welcome" title="You're one of us now" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">Application received</h2>
            <p className="mt-3 text-muted-foreground">A coordinator will reach out within 3–5 days to onboard you and match you with a program.</p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Volunteer" title="Give your time, change a life" description="Tell us about yourself and where you'd like to serve." />
      <section className="container-page py-16 max-w-3xl">
        <Card className="p-8 shadow-soft">
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
              <HandHeart className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </form>
        </Card>
      </section>
    </>
  );
}
