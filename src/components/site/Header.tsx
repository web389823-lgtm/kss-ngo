import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/theme";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "News" },
  { to: "/impact", label: "Impact" },
  { to: "/get-involved", label: "Volunteer" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-full gradient-saffron text-primary-foreground font-serif text-lg font-bold shadow-soft">K</div>
          <div className="leading-tight">
            <div className="font-serif text-base font-semibold">Keshava Seva Samiti</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Service · Sacred · Sustained</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:bg-accent hover:text-foreground transition-colors"
              activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild className="hidden sm:inline-flex">
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
                    className="px-3 py-3 text-base rounded-md hover:bg-accent">{n.label}</Link>
                ))}
                <Link to="/donate" onClick={() => setOpen(false)} className="mt-3 px-3 py-3 rounded-md bg-primary text-primary-foreground text-center font-medium">Donate</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
