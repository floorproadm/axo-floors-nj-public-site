import { Phone, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeLink from "./SafeLink";
import axoLogo from "@/assets/axo-logo-official.png";
import { AXO_PHONE_DISPLAY } from "@/lib/constants";

/**
 * SSR-safe header used by the city + NJ hub TanStack routes.
 * Same visual contract as the SPA Header (top contact bar + black main
 * header + nav + Smart Estimate CTA) but renders without any
 * react-router-dom context — internal links are real <a href> so the
 * markup is valid during server render.
 *
 * The dropdown / mobile drawer interactions of the SPA header are
 * intentionally simplified here; this header serves landing-page
 * crawlability and first-paint, not the in-app navigation experience.
 */
const services = [
  { name: "Hardwood Flooring", href: "/hardwood-flooring" },
  { name: "Sanding & Refinish", href: "/sanding-and-refinish" },
  { name: "Vinyl Plank Flooring", href: "/vinyl-plank-flooring" },
  { name: "Staircase", href: "/staircase" },
  { name: "Base Boards", href: "/base-boards" },
];

const HeaderSSR = () => {
  return (
    <>
      <div className="bg-gold text-black py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <a
            href={`sms:${AXO_PHONE_DISPLAY}?body=Hi! Interested in flooring quote from your website`}
            className="flex items-center gap-2 hover:opacity-80 transition-smooth font-semibold"
          >
            <Phone className="h-4 w-4" />
            {AXO_PHONE_DISPLAY}
          </a>
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/profile.php?id=61562322947267&sk=about"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AXO Floors on Facebook"
              className="w-8 h-8 bg-black text-gold flex items-center justify-center rounded hover:bg-black/80 transition-smooth"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/axofloors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AXO Floors on Instagram"
              className="w-8 h-8 bg-black text-gold flex items-center justify-center rounded hover:bg-black/80 transition-smooth"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <header className="bg-black border-b border-white/10 shadow-elegant sticky top-0 z-[100] w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <SafeLink to="/" className="flex items-center" aria-label="AXO Floors home">
              <img src={axoLogo} alt="AXO Floors" className="h-10 w-auto" />
            </SafeLink>

            <nav className="hidden lg:flex items-center gap-5">
              <details className="relative group">
                <summary className="list-none cursor-pointer text-white hover:text-gold font-medium transition-smooth select-none">
                  Services
                </summary>
                <div className="absolute top-full left-0 mt-2 w-56 bg-black border border-white/10 rounded-lg shadow-elegant z-50 py-2">
                  {services.map((s) => (
                    <SafeLink
                      key={s.name}
                      to={s.href}
                      className="block px-4 py-2 text-white hover:text-gold hover:bg-white/5 transition-smooth text-sm"
                    >
                      {s.name}
                    </SafeLink>
                  ))}
                </div>
              </details>
              <span className="text-gold">|</span>
              <SafeLink to="/quiz" className="text-white hover:text-gold font-medium transition-smooth">
                Smart Estimate
              </SafeLink>
              <span className="text-gold">|</span>
              <SafeLink to="/gallery" className="text-white hover:text-gold font-medium transition-smooth">
                Gallery
              </SafeLink>
              <span className="text-gold">|</span>
              <SafeLink to="/contact" className="text-white hover:text-gold font-medium transition-smooth">
                Contact
              </SafeLink>

              <Button asChild className="ml-4 gold-gradient text-black font-semibold hover:scale-105 transition-bounce">
                <a href="/quiz">Smart Estimate</a>
              </Button>
            </nav>

            {/* Mobile: simple inline nav links (always visible, wrap) */}
            <nav className="lg:hidden flex items-center gap-3 text-sm">
              <SafeLink to="/quiz" className="text-white hover:text-gold font-medium">
                Estimate
              </SafeLink>
              <SafeLink to="/gallery" className="text-white hover:text-gold font-medium">
                Gallery
              </SafeLink>
              <SafeLink to="/contact" className="text-white hover:text-gold font-medium">
                Contact
              </SafeLink>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderSSR;
