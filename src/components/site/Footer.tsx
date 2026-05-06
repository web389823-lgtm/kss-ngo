import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="grid h-9 w-9 place-items-center rounded-full gradient-saffron text-primary-foreground font-serif font-bold">K</div>
            <span className="font-serif text-lg font-semibold">Keshava Seva Samiti</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">A non-profit serving communities across India through education, healthcare and empowerment since 1999.</p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-primary transition-colors"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/programs" className="hover:text-primary">Programs</Link></li>
            <li><Link to="/projects" className="hover:text-primary">Projects</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/blog" className="hover:text-primary">News</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Get Involved</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/donate" className="hover:text-primary">Donate</Link></li>
            <li><Link to="/get-involved" className="hover:text-primary">Volunteer</Link></li>
            <li><Link to="/testimonials" className="hover:text-primary">Testimonials</Link></li>
            <li><Link to="/impact" className="hover:text-primary">Our Impact</Link></li>
            <li><Link to="/team" className="hover:text-primary">Our Team</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> contact@kss.org</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> +91 98765 43210</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> KSS Bhavan, MG Road, Bengaluru</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 flex flex-col sm:flex-row gap-2 justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Keshava Seva Samiti. All rights reserved.</p>
          <p>Reg. Non-profit · 80G eligible · Made with seva</p>
        </div>
      </div>
    </footer>
  );
}
