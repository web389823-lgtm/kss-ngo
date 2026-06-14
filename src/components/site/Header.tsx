import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, LayoutDashboard, LogIn, LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useRef, useState } from "react";
import kssLogo from "@/assets/kss-logo.jpg";

const ABOUT_LINKS = [
  { to: "/about", label: "Our Philosophy" },
  { to: "/about", hash: "impact", label: "Our Impact" },
  { to: "/programs", label: "Our Programs" },
  { to: "/projects", label: "Our Projects" },
  { to: "/team", label: "The Team" },
  { to: "/team", hash: "advisory", label: "Advisory Board" },
  { to: "/team", hash: "trustee", label: "Trustee Members" },
  { to: "/milestones", label: "Our Milestones" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, isStaff, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setAboutOpen(false); setAboutMobileOpen(false); }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!aboutRef.current?.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (to: string) => to === "/" ? path === "/" : path.startsWith(to);
  const aboutActive = ["/about", "/programs", "/projects", "/team", "/milestones"].some((p) => path.startsWith(p));

  return (
    <header className={`kss-glass-nav ${scrolled ? "is-scrolled" : ""}`} data-theme={theme}>
      <div className="kss-glass-nav-inner">
        <Link to="/" className="kss-glass-logo" aria-label="KSS Home">
          <img src={kssLogo} alt="Keshava Seva Samiti" />
          <span className="kss-glass-logo-text">
            <span className="kss-glass-logo-title">Keshava Seva Samiti</span>
            <span className="kss-glass-logo-sub">Since 1999</span>
          </span>
        </Link>

        <nav className="kss-glass-links" aria-label="Primary">
          <Link to="/" className={`kss-glass-link ${isActive("/") ? "is-active" : ""}`}>Home</Link>

          <div ref={aboutRef} className="relative">
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className={`kss-glass-link inline-flex items-center gap-1 ${aboutActive ? "is-active" : ""}`}
              aria-expanded={aboutOpen}
              aria-haspopup="menu"
            >
              About Us <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
            </button>
            {aboutOpen && (
              <div role="menu" className="absolute left-0 top-full mt-2 w-60 rounded-xl border bg-background shadow-xl py-2 z-50">
                {ABOUT_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    hash={(l as any).hash}
                    role="menuitem"
                    className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/get-involved" className={`kss-glass-link ${isActive("/get-involved") ? "is-active" : ""}`}>Get Involved</Link>
          <Link to="/donate" className={`kss-glass-link ${isActive("/donate") ? "is-active" : ""}`}>Donate</Link>
        </nav>

        <div className="kss-glass-actions">
          <button type="button" onClick={toggle} aria-label="Toggle theme" className="kss-glass-icon-btn">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user && isStaff ? (
            <>
              <Link to="/admin" className="kss-glass-ghost-btn hidden md:inline-flex">
                <LayoutDashboard className="mr-1.5 h-4 w-4" />Dashboard
              </Link>
              <button onClick={() => signOut()} className="kss-glass-ghost-btn hidden md:inline-flex">
                <LogOut className="mr-1.5 h-4 w-4" />Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="kss-glass-ghost-btn hidden md:inline-flex">
              <LogIn className="mr-1.5 h-4 w-4" />Admin
            </Link>
          )}
          <Link to="/donate" className="kss-glass-donate">
            <Heart className="h-4 w-4" /> Donate
          </Link>
          <button
            type="button"
            className="kss-glass-burger lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={open ? "is-open" : ""} />
            <span className={open ? "is-open" : ""} />
            <span className={open ? "is-open" : ""} />
          </button>
        </div>
      </div>

      {open && (
        <div className="kss-glass-mobile-menu">
          <Link to="/" className="kss-glass-mobile-link">Home</Link>
          <button
            type="button"
            onClick={() => setAboutMobileOpen((v) => !v)}
            className="kss-glass-mobile-link text-left w-full inline-flex items-center justify-between"
            aria-expanded={aboutMobileOpen}
          >
            About Us <ChevronDown className={`h-4 w-4 transition-transform ${aboutMobileOpen ? "rotate-180" : ""}`} />
          </button>
          {aboutMobileOpen && (
            <div className="pl-4 border-l-2 border-primary/30 ml-3">
              {ABOUT_LINKS.map((l) => (
                <Link key={l.label} to={l.to} hash={(l as any).hash} className="kss-glass-mobile-link block text-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
          <Link to="/get-involved" className="kss-glass-mobile-link">Get Involved</Link>
          {user && isStaff ? (
            <Link to="/admin" className="kss-glass-mobile-link">Dashboard</Link>
          ) : (
            <Link to="/admin/login" className="kss-glass-mobile-link">Admin Login</Link>
          )}
          <Link to="/donate" className="kss-glass-mobile-donate">Donate</Link>
        </div>
      )}
    </header>
  );
}
