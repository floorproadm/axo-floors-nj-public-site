import { ADS_CONSENT_NOTICE } from "@/lib/ads-consent";

// Small, always-visible notice above the final submit button of lead forms.
// The notice plus clicking submit is the consent action — no checkbox.
export default function AdsConsentNotice({ className = "" }: { className?: string }) {
  const [before, after] = ADS_CONSENT_NOTICE.split("Privacy Policy");
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      {before}
      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
        Privacy Policy
      </a>
      {after}
    </p>
  );
}
