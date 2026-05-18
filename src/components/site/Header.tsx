import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, Heart, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "News" },
  { to: "/get-involved", label: "Get Involved" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, isStaff, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md animate-fade-in transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="container-page flex h-20 items-center justify-between gap-6 pl-2 md:pl-4">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] mr-4">
          <div className="grid h-11 w-11 place-items-center rounded-full gradient-saffron text-primary-foreground font-serif text-xl font-bold shadow-soft">K</div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold">Keshava Seva Samiti</div>
            <div className="text-[11px] text-muted-foreground tracking-wider uppercase">Since 1999</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}
              className="px-4 py-2.5 text-[15px] font-medium text-foreground/80 rounded-md hover:bg-accent hover:text-foreground transition-all duration-200"
              activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="transition-transform hover:scale-110">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user && isStaff ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:inline-flex">
                <LogOut className="mr-2 h-4 w-4" />Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link to="/admin/login"><LogIn className="mr-2 h-4 w-4" />Admin Login</Link>
            </Button>
          )}

          <Button asChild className="hidden sm:inline-flex transition-transform hover:scale-[1.04]">
            <Link to="/donate"><Heart className="mr-2 h-4 w-4" /> Donate</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                    className="px-3 py-3 text-base rounded-md hover:bg-accent transition-colors">{n.label}</Link>
                ))}
                {user && isStaff ? (
                  <>
                    <Link to="/admin" onClick={() => setOpen(false)} className="mt-3 px-3 py-3 rounded-md border text-center font-medium">Dashboard</Link>
                    <button onClick={() => { signOut(); setOpen(false); }} className="px-3 py-3 rounded-md text-left hover:bg-accent">Logout</button>
                  </>
                ) : (
                  <Link to="/admin/login" onClick={() => setOpen(false)} className="mt-3 px-3 py-3 rounded-md border text-center font-medium">Admin Login</Link>
                )}
                <Link to="/donate" onClick={() => setOpen(false)} className="mt-3 px-3 py-3 rounded-md bg-primary text-primary-foreground text-center font-medium">Donate</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
