/**
 * /vinyl-plank-flooring is temporarily hidden at the owner's request.
 * The URL answers 404 (no redirect, so nothing is handed to another page)
 * and tells crawlers not to index it. The page source stays in the repo so
 * the owner can resume work on it later.
 */
const BODY = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<meta name="robots" content="noindex,nofollow">',
  "<title>Page not found | AXO Floors NJ</title>",
  "<style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}h1{font-size:3rem;margin:0 0 .5rem}p{margin:.25rem 0}</style>",
  "</head>",
  "<body>",
  "<main>",
  "<h1>404</h1>",
  "<p>Oops! Page not found</p>",
  '<p><a href="/">Return to Home</a> &middot; <a href="/installation">Flooring Installation</a> &middot; <a href="/refinishing">Sanding &amp; Refinishing</a> &middot; <a href="/contact">Contact</a></p>',
  "</main>",
  "</body>",
  "</html>",
].join("");

export const vinylPageHidden = () =>
  new Response(BODY, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "no-store",
    },
  });
