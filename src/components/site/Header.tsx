import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, LayoutDashboard, LogIn, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import kssLogo from "@/assets/kss-logo.jpg";

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
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  const isActive = (to: string) => to === "/" ? path === "/" : path.startsWith(to);

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
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`kss-glass-link ${isActive(n.to) ? "is-active" : ""}`}>
              {n.label}
            </Link>
          ))}
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
          {NAV.map((n, i) => (
            <Link key={n.to} to={n.to} className="kss-glass-mobile-link" style={{ animationDelay: `${i * 50}ms` }}>
              {n.label}
            </Link>
          ))}
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
