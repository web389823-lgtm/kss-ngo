import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts, Link, useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollProgressBar from "@/components/site/ScrollProgressBar";
import FloatingContactButton from "@/components/site/FloatingContactButton";
import SiteEnhancements from "@/components/site/SiteEnhancements";
import StickyDonateBar from "@/components/site/StickyDonateBar";
import MobileBottomNav from "@/components/site/MobileBottomNav";
import ImageLightbox from "@/components/site/ImageLightbox";

import SocialProofPopup from "@/components/site/SocialProofPopup";
import ExitIntentPopup from "@/components/site/ExitIntentPopup";
import ShareButton from "@/components/site/ShareButton";
import WhatsAppButton from "@/components/site/WhatsAppButton";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "#FAF7F2" }}>
      <div className="max-w-lg text-center">
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            fontSize: "clamp(5rem, 14vw, 9rem)",
            lineHeight: 1,
            background: "linear-gradient(135deg, #E8540A, #FF8C42, #E8540A)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          404
        </div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2rem)", color: "#1a1a1a", marginTop: 8 }}>
          Oops! Page Not Found
        </h1>
        <p style={{ marginTop: 12, color: "#666", fontFamily: "Inter, sans-serif" }}>
          This page wandered off. But our seva continues.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" style={{ background: "#E8540A", color: "#fff", padding: "12px 26px", borderRadius: 999, fontWeight: 600, fontFamily: "Inter, sans-serif", fontSize: 14 }}>
            🏠 Back to Home
          </Link>
          <Link to="/programs" style={{ background: "#fff", color: "#E8540A", padding: "12px 26px", borderRadius: 999, fontWeight: 600, fontFamily: "Inter, sans-serif", fontSize: 14, border: "1.5px solid #E8540A" }}>
            📋 View Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Keshava Seva Samiti — Service to Humanity" },
      { name: "description", content: "KSS is an Indian non-profit serving communities through education, healthcare, women empowerment and welfare since 2007." },
      { property: "og:title", content: "Keshava Seva Samiti — Service to Humanity" },
      { property: "og:description", content: "KSS is an Indian non-profit serving communities through education, healthcare, women empowerment and welfare since 2007." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Keshava Seva Samiti — Service to Humanity" },
      { name: "twitter:description", content: "KSS is an Indian non-profit serving communities through education, healthcare, women empowerment and welfare since 2007." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d4522595-135c-415b-8682-1cadcd5ff76a" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d4522595-135c-415b-8682-1cadcd5ff76a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (document.getElementById("jotform-agent-embed")) return;
    const s = document.createElement("script");
    s.id = "jotform-agent-embed";
    s.src = "https://cdn.jotfor.ms/agent/embedjs/019e65ac2e497ed98d7c0ae0793f5def2a9d/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className={`flex-1 ${isHome ? "" : "pt-20"}`}><Outlet /></main>
            <Footer />
          </div>
          <ScrollProgressBar />
          <SiteEnhancements />
          <FloatingContactButton />
          <StickyDonateBar />
          <MobileBottomNav />
          <ImageLightbox />
          <WhatsAppButton />
          <SocialProofPopup />
          <ExitIntentPopup />
          <ShareButton />
          <Toaster />
        </AuthProvider>

      </ThemeProvider>
    </QueryClientProvider>
  );
}
