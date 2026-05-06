import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Heart, HandHeart, BookOpen, FolderKanban, Image, Newspaper, Quote, BarChart3, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/donations", label: "Donations", icon: Heart },
  { to: "/admin/volunteers", label: "Volunteers", icon: HandHeart },
  { to: "/admin/programs", label: "Programs", icon: BookOpen },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/impact", label: "Impact Stats", icon: BarChart3 },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user && path !== "/admin/login") nav({ to: "/admin/login" });
  }, [loading, user, path, nav]);

  if (path === "/admin/login") return <Outlet />;
  if (loading) return <div className="container-page py-20 text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="container-page py-20 max-w-lg">
        <Card className="p-10 text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive mb-3" />
          <h1 className="font-serif text-2xl font-semibold">Admin access required</h1>
          <p className="text-sm text-muted-foreground mt-2">Your account is signed in but not yet an admin. An existing admin can grant you access from the database.</p>
          <p className="text-xs text-muted-foreground mt-3">Your user ID: <code className="bg-muted px-2 py-0.5 rounded">{user.id}</code></p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
            <Button asChild><Link to="/">Back to site</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 self-start">
          <Card className="p-3">
            <nav className="space-y-1">
              {NAV.map(({ to, label, icon: Icon, exact }) => {
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
