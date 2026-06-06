import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "AXO Floors - Professional Hardwood Flooring Refinishing & Installation" },
      { name: "description", content: "Expert hardwood flooring services in New Jersey. Professional installation, refinishing, and restoration. Free estimates, licensed & insured. Call (732) 351-8653" },
      { name: "keywords", content: "hardwood flooring NJ, floor refinishing New Jersey, flooring installation, wood floor restoration, AXO Floors, Newark flooring, Jersey City floors" },
      { name: "author", content: "AXO Floors NJ" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AXO Floors NJ" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: "AXO Floors - Professional Hardwood Flooring Refinishing & Installation" },
      { property: "og:description", content: "Expert hardwood flooring services in New Jersey. Professional installation, refinishing, and restoration. Free estimates, licensed & insured. Call (732) 351-8653" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AXO Floors NJ - Professional Hardwood Flooring Services" },
      { name: "twitter:description", content: "Expert hardwood flooring installation & refinishing in New Jersey. Licensed, insured, free estimates." },
    ],
    links: [
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "AXO Floors NJ",
          image: "https://axofloorsnj.com/logo.png",
          description:
            "Professional hardwood flooring installation, refinishing, and restoration services in New Jersey",
          address: { "@type": "PostalAddress", addressRegion: "NJ", addressCountry: "US" },
          telephone: "(732) 351-8653",
          email: "axofloorsnj@gmail.com",
          url: "https://axofloorsnj.com",
          priceRange: "$$",
          serviceArea: { "@type": "State", name: "New Jersey" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "47" },
          openingHours: "Mo-Sa 08:00-18:00",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <RouterProvider>
      <Outlet />
    </RouterProvider>
  ),
  notFoundComponent: () => (
    <RouterProvider>
      <Outlet />
    </RouterProvider>
  ),
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <RouterProvider>
        <Outlet />
      </RouterProvider>
    );
  },
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
