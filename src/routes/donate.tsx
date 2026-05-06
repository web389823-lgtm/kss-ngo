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
import { CheckCircle2, Heart } from "lucide-react";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({ meta: [
    { title: "Donate — Keshava Seva Samiti" },
    { name: "description", content: "Support KSS's work in education, healthcare and empowerment. 80G eligible donation registration." },
  ]}),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  aadhaar: z.string().trim().max(20).optional().or(z.literal("")),
  pan: z.string().trim().max(20).optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  age: z.coerce.number().int().min(0).max(120).optional().or(z.nan()),
  amount: z.coerce.number().positive().max(10000000),
  purpose: z.string().trim().max(500).optional().or(z.literal("")),
});

const AMOUNTS = [500, 1000, 2500, 5000, 10000];

function DonatePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(1000);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse({ ...raw, amount });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const payload: any = { ...parsed.data };
    if (!payload.age || Number.isNaN(payload.age)) delete payload.age;
    Object.keys(payload).forEach((k) => payload[k] === "" && delete payload[k]);
    const { error } = await supabase.from("donations").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    toast.success("Thank you! Your registration has been received.");
  }

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Thank You" title="Your generosity moves us" />
        <section className="container-page py-16 max-w-2xl">
          <Card className="p-10 text-center shadow-soft">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold">Registration received</h2>
            <p className="mt-3 text-muted-foreground">Our team will reach out within 24 hours with payment instructions and your 80G receipt details.</p>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Donate" title="Your gift creates change" description="Register your donation below. Our team will follow up with secure payment instructions and an 80G tax-exemption receipt." />
      <section className="container-page py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8 shadow-soft">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 block">Donation Amount (₹)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {AMOUNTS.map((a) => (
                    <Button key={a} type="button" variant={amount === a ? "default" : "outline"} size="sm" onClick={() => setAmount(a)}>₹{a.toLocaleString()}</Button>
                  ))}
                </div>
                <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label htmlFor="full_name">Full Name *</Label><Input id="full_name" name="full_name" required /></div>
                <div><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" required /></div>
                <div className="md:col-span-2"><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} /></div>
                <div><Label htmlFor="aadhaar">Aadhaar</Label><Input id="aadhaar" name="aadhaar" /></div>
                <div><Label htmlFor="pan">PAN</Label><Input id="pan" name="pan" /></div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender">
                    <SelectTrigger id="gender"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" min={0} max={120} /></div>
                <div className="md:col-span-2"><Label htmlFor="purpose">Purpose / Dedication</Label><Textarea id="purpose" name="purpose" rows={2} placeholder="e.g. for the Sponsor a Child program" /></div>
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                <Heart className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit Donation Registration"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Your information is kept secure and used only for processing your donation.</p>
            </form>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="p-6 shadow-soft"><h3 className="font-serif text-lg font-semibold">Where your money goes</h3>
            <ul className="mt-3 text-sm text-muted-foreground space-y-2">
              <li>₹500 — A month of study materials for one child</li>
              <li>₹2,500 — A monthly grocery kit for a family</li>
              <li>₹5,000 — A medical equipment grant</li>
              <li>₹10,000 — Sponsor a child's annual education</li>
            </ul>
          </Card>
          <Card className="p-6 shadow-soft bg-accent/40">
            <h3 className="font-serif text-lg font-semibold">Tax benefits</h3>
            <p className="mt-2 text-sm text-muted-foreground">All donations are eligible for tax exemption under Section 80G. You'll receive a receipt within 7 days.</p>
          </Card>
        </aside>
      </section>
    </>
  );
}
