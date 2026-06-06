import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, Phone, ChevronDown, Facebook, Instagram, X } from "lucide-react";
import { useState } from "react";
import { AXO_PHONE_DISPLAY, AXO_FACEBOOK, AXO_INSTAGRAM } from "@/lib/constants";

const services = [
  { label: "Hardwood Flooring", to: "/installation" },
  { label: "Sanding & Refinish", to: "/refinishing" },
  { label: "Vinyl Plank Flooring", to: "/vinyl-plank-flooring" },
  { label: "Staircase", to: "/staircase" },
  { label: "Base Boards", to: "/base-boards" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="navy-gradient text-white text-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <a
            href={`sms:${AXO_PHONE_DISPLAY}?body=Hi! Interested in flooring quote from your website`}
            className="inline-flex items-center gap-2 hover:text-[var(--gold-accent)] transition-smooth"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{AXO_PHONE_DISPLAY}</span>
          </a>
          <div className="hidden sm:flex items-center gap-3">
            <a href={AXO_FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4 hover:text-[var(--gold-accent)]" />
            </a>
            <a href={AXO_INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4 hover:text-[var(--gold-accent)]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-baseline gap-1 font-heading">
            <span className="text-2xl font-extrabold tracking-tight text-navy">
              •AXO•
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-grey">FLOORS</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="inline-flex items-center gap-1 hover:text-[var(--gold-warm)] transition-smooth">
                Services <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 top-full pt-2 w-56">
                  <div className="bg-popover border border-border rounded-md shadow-elegant p-2">
                    {services.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block px-3 py-2 rounded hover:bg-secondary text-sm"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/quiz" className="hover:text-[var(--gold-warm)]">Smart Estimate</Link>
            <Link to="/gallery" className="hover:text-[var(--gold-warm)]">Gallery</Link>
            <Link to="/about" className="hover:text-[var(--gold-warm)]">About</Link>
            <Link to="/contact" className="hover:text-[var(--gold-warm)]">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex gold-gradient text-navy font-semibold hover:opacity-90">
              <Link to="/quiz">Smart Estimate</Link>
            </Button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground pt-1 pb-2">Services</p>
              {services.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm"
                >
                  {s.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link to="/quiz" onClick={() => setOpen(false)} className="block py-2">Smart Estimate</Link>
              <Link to="/gallery" onClick={() => setOpen(false)} className="block py-2">Gallery</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="block py-2">About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="block py-2">Contact</Link>
              <Button asChild className="w-full mt-2 gold-gradient text-navy font-semibold">
                <Link to="/quiz" onClick={() => setOpen(false)}>Smart Estimate</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
