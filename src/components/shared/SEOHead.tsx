// SEOHead is a no-op in TanStack Start — real <head> is set via the route's head() option.
// This component exists for API compatibility with the AXO blueprint.
export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  children?: React.ReactNode;
}

export default function SEOHead(_: SEOHeadProps) {
  return null;
}
