import { Phone, Facebook, Instagram, Menu, ChevronDown, X } from "lucide-react";
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
 * Uses native HTML controls so the desktop dropdown and mobile drawer remain
 * interactive without depending on the SPA router.
 */
const services = [
  { name: "Sanding & Refinishing", href: "/sanding-and-refinish" },
  { name: "Flooring Installation", href: "/hardwood-flooring" },
  { name: "Stairs & Railings", href: "/stairs" },
  { name: "Vinyl Plank Flooring", href: "/vinyl-plank-flooring" },
];

const mobileLinks = [
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Stain Colors", href: "/stain-gallery" },
  { name: "Builders", href: "/builders" },
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
              <SafeLink to="/gallery" className="text-white hover:text-gold font-medium transition-smooth">
                Gallery
              </SafeLink>
              <span className="text-gold">|</span>
              <SafeLink to="/blog" className="text-white hover:text-gold font-medium transition-smooth">
                Blog
              </SafeLink>
              <span className="text-gold">|</span>
              <SafeLink to="/contact" className="text-white hover:text-gold font-medium transition-smooth">
                Contact
              </SafeLink>


              <Button asChild className="ml-4 gold-gradient text-black font-semibold hover:scale-105 transition-bounce">
                <a href="/get-started">Smart Estimate</a>
              </Button>
            </nav>

            <div className="lg:hidden">
              <input id="axo-ssr-menu" type="checkbox" className="peer sr-only" />
              <label
                htmlFor="axo-ssr-menu"
                className="flex cursor-pointer items-center justify-center p-2 text-white transition-smooth hover:text-gold"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </label>

              <div className="fixed inset-0 z-[9999] hidden bg-black/80 backdrop-blur-sm peer-checked:block">
                <label htmlFor="axo-ssr-menu" className="absolute inset-0 cursor-pointer" aria-label="Close menu" />
                <aside className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-black shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 p-3">
                    <SafeLink to="/" className="flex items-center" aria-label="AXO Floors home">
                      <img src={axoLogo} alt="AXO Floors" className="h-8 w-auto" />
                    </SafeLink>
                    <label
                      htmlFor="axo-ssr-menu"
                      className="cursor-pointer rounded-full p-2 text-white transition-all hover:bg-white/10 hover:text-gold"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </label>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="mb-4 px-3">
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-white transition-all hover:bg-white/5 hover:text-gold">
                          <span className="text-base font-semibold">Services</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-2 space-y-1">
                          {services.map((service) => (
                            <SafeLink
                              key={service.name}
                              to={service.href}
                              className="ml-2 block rounded-xl px-6 py-3 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
                            >
                              {service.name}
                            </SafeLink>
                          ))}
                        </div>
                      </details>
                    </div>

                    <nav className="space-y-1 px-3" aria-label="Mobile navigation">
                      {mobileLinks.map((item) => (
                        <SafeLink
                          key={item.name}
                          to={item.href}
                          className={`block rounded-xl px-4 py-3 font-medium transition-all hover:bg-white/5 hover:text-gold ${
                            item.href === "/blog" ? "border-l-2 border-gold bg-gold/10 text-gold" : "text-white"
                          }`}
                        >
                          {item.name}
                        </SafeLink>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-3 border-t border-white/10 p-4">
                    <SafeLink
                      to="/get-started"
                      className="block w-full rounded-xl bg-gradient-to-r from-gold to-gold-warm px-4 py-3 text-center font-bold text-black transition-all hover:shadow-lg"
                    >
                      SMART ESTIMATE
                    </SafeLink>
                    <SafeLink
                      to="/contact"
                      className="block w-full rounded-xl border-2 border-gold px-4 py-3 text-center font-semibold text-gold transition-all hover:bg-gold hover:text-black"
                    >
                      CONTACT US
                    </SafeLink>
                    <div className="pt-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                        <span>Google</span>
                        <span className="text-gold">★★★★★</span>
                        <span>35+ Reviews</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderSSR;
