import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * Router-context-free link used by SSR-rendered route components
 * (city + NJ hub). Renders a plain <a href> so the markup is valid
 * during server render before any client router is mounted.
 *
 * Internal navigation from these pages causes a normal browser
 * navigation; the destination is either another SSR route (city / hub)
 * or the SPA splat which boots <App />.
 */
interface SafeLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  children: ReactNode;
}

const SafeLink = ({ to, children, ...rest }: SafeLinkProps) => (
  <a href={to} {...rest}>
    {children}
  </a>
);

export default SafeLink;
