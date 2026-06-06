import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Phone, Wrench, Images, Palette, Star, Gift } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_E164, AXO_FACEBOOK, AXO_INSTAGRAM } from "@/lib/constants";

export const Route = createFileRoute("/hub")({
  head: () => ({ meta: [{ title: "AXO Floors — Quick Links" }, { name: "description", content: "Premium Flooring Services in NJ, NY & PA." }] }),
  component: Hub,
});

const links: { label: string; to?: string; href?: string; icon: typeof Phone }[] = [
  { label: "Get Your Free Estimate", to: "/contact", icon: Calendar },
  { label: `Call Us — ${AXO_PHONE_DISPLAY}`, href: `tel:${AXO_PHONE_E164}`, icon: Phone },
  { label: "Smart Estimate Quiz", to: "/quiz", icon: Wrench },
  { label: "See Our Work", to: "/gallery", icon: Images },
  { label: "Stain Gallery", to: "/stain-gallery", icon: Palette },
  { label: "About Us", to: "/about", icon: Star },
  { label: "Refer & Earn $100", to: "/referral-program", icon: Gift },
];

function Hub() {
  return (
    <div className="min-h-screen navy-gradient text-white">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-8">
          <div className="font-heading">
            <span className="text-3xl font-extrabold text-gradient-gold">•AXO•</span>
            <span className="ml-1 text-sm font-bold tracking-[0.25em]">FLOORS</span>
          </div>
          <p className="text-sm text-white/70 mt-2">Premium Flooring Services in NJ, NY & PA</p>
        </div>

        <div className="space-y-3">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-4 transition-smooth backdrop-blur">
                <l.icon className="h-5 w-5 text-[var(--gold-accent)]" />
                <span className="font-semibold">{l.label}</span>
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-4 transition-smooth backdrop-blur">
                <l.icon className="h-5 w-5 text-[var(--gold-accent)]" />
                <span className="font-semibold">{l.label}</span>
              </a>
            )
          )}
        </div>

        <div className="flex justify-center gap-5 mt-8 text-white/70 text-sm">
          <a href={AXO_INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
          <a href={AXO_FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
        </div>
        <p className="text-center text-xs text-white/50 mt-6">© 2026 AXO Floors</p>
      </div>
    </div>
  );
}
