import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Heart, HandHeart, Building2, BookOpen, FolderKanban, Image, Newspaper, Quote, BarChart3, Users, UsersRound, Activity, Settings, LogOut, ShieldAlert, ShieldCheck, UserCog, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; adminOnly?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/donations", label: "Donations", icon: Heart },
  { to: "/admin/volunteers", label: "Volunteer Applications", icon: HandHeart },
  { to: "/admin/csr", label: "CSR Applications", icon: Building2 },
  { to: "/admin/programs", label: "Programs", icon: BookOpen },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/images", label: "Card Images", icon: ImagePlus },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote, adminOnly: true },
  
  { to: "/admin/team", label: "Team", icon: Users, adminOnly: true },
  { to: "/admin/users", label: "Admins & Staff", icon: UsersRound, adminOnly: true },
  { to: "/admin/activity", label: "Activity Log", icon: Activity, adminOnly: true },
  { to: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
];

function AdminLayout() {
  const { user, role, isStaff, isAdmin, loading, signOut, refreshRole } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user && path !== "/admin/login") nav({ to: "/admin/login" });
  }, [loading, user, path, nav]);

  // Apply pending role claim after email verification + first sign-in
  useEffect(() => {
    if (!user || role) return;
    const raw = sessionStorage.getItem("pending_role_claim");
    if (!raw) return;
    sessionStorage.removeItem("pending_role_claim");
    try {
      const { role: r, code } = JSON.parse(raw);
      supabase.rpc("claim_role", { _role: r, _access_code: code }).then(async ({ data, error }) => {
        if (error) return toast.error(error.message);
        const res = data as { ok: boolean; error?: string };
        if (!res.ok) toast.error(res.error === "invalid_code" ? "Invalid Access Code" : "Could not assign role");
        else { await refreshRole(); toast.success("Role activated"); }
      });
    } catch { /* ignore */ }
  }, [user, role, refreshRole]);

  if (path === "/admin/login") return <Outlet />;
  if (loading) return <div className="container-page py-20 text-muted-foreground">Loading…</div>;
  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="container-page py-20 max-w-lg">
        <Card className="p-10 text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive mb-3" />
          <h1 className="font-serif text-2xl font-semibold">Admin access required</h1>
          <p className="text-sm text-muted-foreground mt-2">Your account is signed in but has no admin/staff role yet.</p>
          <p className="text-xs text-muted-foreground mt-3">Sign up again with the correct Access Code, or ask an existing admin.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
            <Button asChild><Link to="/">Back to site</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  const items = NAV.filter((n) => !n.adminOnly || isAdmin);

  return (
    <div className="container-page py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 self-start">
          <Card className="p-3">
            <div className="px-3 py-3 mb-2 rounded-md gradient-saffron text-primary-foreground">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
                {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserCog className="h-3.5 w-3.5" />}
                {isAdmin ? "Administrator" : "Staff"}
              </div>
              <div className="text-sm font-medium truncate mt-0.5">{user.email}</div>
            </div>
            <nav className="space-y-1">
              {items.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? path === to : path.startsWith(to);
                return (
                  <Link key={to} to={to} className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                );
              })}
              <button onClick={signOut} className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-muted-foreground">
                <LogOut className="h-4 w-4" />Sign out
              </button>
            </nav>
          </Card>
        </aside>
        <div className="min-w-0"><Outlet /></div>
      </div>
    </div>
  );
}
