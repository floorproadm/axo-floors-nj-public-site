import { Link } from "@tanstack/react-router";
import { Phone, Mail, Facebook, Instagram } from "lucide-react";
import {
  AXO_PHONE_DISPLAY,
  AXO_PHONE_TEL,
  AXO_EMAIL,
  AXO_FACEBOOK,
  AXO_INSTAGRAM,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="navy-gradient text-white mt-auto">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-1 font-heading">
            <span className="text-2xl font-extrabold tracking-tight text-gradient-gold">•AXO•</span>
            <span className="text-xs font-bold tracking-[0.25em]">FLOORS</span>
          </div>
          <p className="mt-3 text-sm text-white/70 max-w-md">
            We bring your vision to life. Hardwood installation, refinishing, and restoration across NJ, NY & PA.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href={AXO_FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[var(--gold-accent)]">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={AXO_INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[var(--gold-accent)]">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-wider text-[var(--gold-accent)] mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-wider text-[var(--gold-accent)] mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href={AXO_PHONE_TEL} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" /> {AXO_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${AXO_EMAIL}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" /> {AXO_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 text-xs text-white/60 flex justify-between">
          <span>© 2025 AXO Floors. All rights reserved.</span>
          <span>NJ • NY • PA</span>
        </div>
      </div>
    </footer>
  );
}
