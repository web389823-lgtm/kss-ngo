import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lock, ShieldCheck, UserCog, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/admin/login")({ component: AuthPage });

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  password: z.string().min(6, "Min 6 characters").max(72),
  confirm: z.string(),
  role: z.enum(["admin", "staff"]),
  access_code: z.string().min(1, "Access code required"),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

function AuthPage() {
  const nav = useNavigate();
  const { user, role, refreshRole } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [signupRole, setSignupRole] = useState<"admin" | "staff">("admin");

  useEffect(() => {
    if (user && role) nav({ to: "/admin" });
  }, [user, role, nav]);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    if (error) { setBusy(false); return toast.error("Invalid email or password"); }

    // If user signed up before role claim, finalize it now
    const pending = sessionStorage.getItem("pending_role_claim");
    if (pending) {
      try {
        const { role: r, code } = JSON.parse(pending);
        await supabase.rpc("claim_role", { _role: r, _access_code: code });
      } catch { /* ignore */ }
      sessionStorage.removeItem("pending_role_claim");
    }

    await refreshRole();
    setBusy(false);
    toast.success("Welcome back");
    nav({ to: "/admin" });
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      full_name: fd.get("full_name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      password: fd.get("password"),
      confirm: fd.get("confirm"),
      role: signupRole,
      access_code: fd.get("access_code"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const v = parsed.data;

    setBusy(true);
    const { error: suErr } = await supabase.auth.signUp({
      email: v.email, password: v.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: v.full_name, phone: v.phone },
      },
    });
    if (suErr) { setBusy(false); return toast.error(suErr.message); }

    // Try to claim role immediately (works if email confirmation is off OR user is already signed in)
    const { data: sess } = await supabase.auth.getSession();
    if (sess.session) {
      const { data, error } = await supabase.rpc("claim_role", {
        _role: v.role, _access_code: v.access_code,
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      const res = data as { ok: boolean; error?: string; role?: string };
      if (!res.ok) {
        if (res.error === "invalid_code") return toast.error("Invalid Access Code");
        return toast.error(res.error ?? "Signup failed");
      }
      await refreshRole();
      toast.success(`Account created — signed in as ${res.role}`);
      nav({ to: "/admin" });
    } else {
      setBusy(false);
      toast.success("Account created. Verify your email, then sign in to activate your role.");
      // Stash code so we can claim after first sign-in
      sessionStorage.setItem("pending_role_claim", JSON.stringify({ role: v.role, code: v.access_code }));
      setTab("signin");
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-12 gradient-hero">
      <Card className="w-full max-w-md p-8 shadow-elevated animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full gradient-saffron grid place-items-center text-primary-foreground mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">KSS Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in or create a staff/admin account.</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4 mt-5">
              <div><Label htmlFor="si-email">Email</Label><Input id="si-email" name="email" type="email" required /></div>
              <div><Label htmlFor="si-pw">Password</Label><Input id="si-pw" name="password" type="password" required /></div>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4 mt-5">
              <div><Label htmlFor="su-name">Full name</Label><Input id="su-name" name="full_name" required /></div>
              <div><Label htmlFor="su-email">Email</Label><Input id="su-email" name="email" type="email" required /></div>
              <div><Label htmlFor="su-phone">Phone</Label><Input id="su-phone" name="phone" type="tel" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="su-pw">Password</Label><Input id="su-pw" name="password" type="password" minLength={6} required /></div>
                <div><Label htmlFor="su-cpw">Confirm</Label><Input id="su-cpw" name="confirm" type="password" minLength={6} required /></div>
              </div>

              <div>
                <Label className="mb-2 block">Role</Label>
                <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-1">
                  {([
                    { v: "admin", label: "Admin", icon: ShieldCheck },
                    { v: "staff", label: "Staff", icon: UserCog },
                  ] as const).map((o) => (
                    <button key={o.v} type="button" onClick={() => setSignupRole(o.v)}
                      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${signupRole === o.v ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                      <o.icon className="h-4 w-4" />{o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="su-code">Access Code</Label>
                <Input id="su-code" name="access_code" type="password" required placeholder="Provided by KSS leadership" />
                <p className="mt-1 text-xs text-muted-foreground">Required code differs by role. Contact KSS leadership if unsure.</p>
              </div>

              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</> : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary">← Back to site</Link>
      </Card>
    </div>
  );
}
