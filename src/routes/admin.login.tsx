import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  if (user) { setTimeout(() => nav({ to: "/admin" }), 0); }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav({ to: "/admin" });
  }
  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")), password: String(fd.get("password")),
      options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name: fd.get("full_name") } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email to verify, then sign in.");
  }

  return (
    <div className="container-page py-20 max-w-md">
      <Card className="p-8 shadow-elevated">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full gradient-saffron grid place-items-center text-primary-foreground mb-3"><Lock className="h-5 w-5" /></div>
          <h1 className="font-serif text-2xl font-semibold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to the KSS admin panel.</p>
        </div>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Create account</TabsTrigger></TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4 mt-4">
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
              <Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Sign in"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4 mt-4">
              <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" required /></div>
              <div><Label htmlFor="email2">Email</Label><Input id="email2" name="email" type="email" required /></div>
              <div><Label htmlFor="password2">Password</Label><Input id="password2" name="password" type="password" minLength={6} required /></div>
              <Button type="submit" disabled={busy} className="w-full">{busy ? "Creating…" : "Create account"}</Button>
              <p className="text-xs text-muted-foreground text-center">An admin must grant you admin access from the database.</p>
            </form>
          </TabsContent>
        </Tabs>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary">← Back to site</Link>
      </Card>
    </div>
  );
}
