import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ignorePublicSubmission } from "@/lib/public-lead";

export function usePublicLeadGuard(active = true) {
  const renderedAt = useRef(Date.now());
  const [website, setWebsite] = useState("");
  useEffect(() => { if (active) { renderedAt.current = Date.now(); setWebsite(""); } }, [active]);
  return { website, setWebsite, shouldIgnore: () => ignorePublicSubmission(website, renderedAt.current) };
}
export default function LeadHoneypot({ guard }: { guard: ReturnType<typeof usePublicLeadGuard> }) {
  return <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
    <Input name="company_website" aria-label="Company website" tabIndex={-1} autoComplete="off" value={guard.website} onChange={(e) => guard.setWebsite(e.target.value)} />
  </div>;
}