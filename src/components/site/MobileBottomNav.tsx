import { Link, useRouterState } from "@tanstack/react-router";

type Tab = { to: string; icon: string; label: string; exact?: boolean; hash?: string };
const TABS: Tab[] = [
  { to: "/", icon: "🏠", label: "Home", exact: true },
  { to: "/programs", icon: "📋", label: "Programs" },
  { to: "/donate", icon: "❤️", label: "Donate" },
  { to: "/get-involved", icon: "🤝", label: "Involve" },
  { to: "/", icon: "📞", label: "Contact", hash: "get-in-touch" },
];

export default function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/admin")) return null;

  return (
    <nav className="kss-mobile-bottom-nav" aria-label="Mobile primary">
      {TABS.map((t, i) => {
        const active = t.label === "Contact" ? false : t.exact ? path === t.to : path.startsWith(t.to);
        return (
          <Link
            key={i}
            to={t.to}
            hash={(t as any).hash}
            className={`kss-mb-tab ${active ? "is-active" : ""}`}
          >
            <span className="kss-mb-dot" aria-hidden />
            <span className="kss-mb-icon">{t.icon}</span>
            <span className="kss-mb-label">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
