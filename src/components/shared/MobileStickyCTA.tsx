import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, CalendarCheck } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

/**
 * Mobile-only sticky bottom action bar shown on the core marketing pages.
 * Primary CTA (free estimate) + one-tap call button.
 */
const CORE_PATHS = [
  "/",
  "/installation",
  "/refinishing",
  "/vinyl-plank-flooring",
  "/stain-gallery",
  "/gallery",
  "/about",
  "/contact",
  "/quiz",
  "/schedule-estimate",
];

const MobileStickyCTA = () => {
  const { pathname } = useLocation();
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const show = CORE_PATHS.includes(normalized);

  useEffect(() => {
    if (!show) return;
    const cls = "has-mobile-sticky-cta";
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [show]);

  if (!show) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-2 px-3 py-3">
        <Link
          to="/get-started"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm font-semibold text-black shadow-soft active:scale-[0.99] transition-smooth"
        >
          <CalendarCheck className="h-4 w-4" />
          Get My Free Estimate
        </Link>
        <a
          href={`tel:${AXO_PHONE_TEL}`}
          aria-label={`Call AXO Floors at ${AXO_PHONE_DISPLAY}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gold/60 text-gold active:scale-[0.98] transition-smooth"
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default MobileStickyCTA;
