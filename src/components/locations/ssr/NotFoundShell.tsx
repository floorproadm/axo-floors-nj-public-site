import HeaderSSR from "./HeaderSSR";
import FooterSSR from "./FooterSSR";
import SafeLink from "./SafeLink";

/**
 * Minimal SSR-rendered 404 for the city slug route. Returned by
 * TanStack Router when the loader throws notFound(); the response is
 * a real HTTP 404 with full server-rendered body so crawlers don't
 * see a soft-200 SPA shell.
 */
const NotFoundShell = () => {
  return (
    <>
      <HeaderSSR />
      <main className="bg-background">
        <section className="container mx-auto px-4 py-20 md:py-28 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-navy mb-5">
            This service-area page isn't available.
          </h1>
          <p className="text-base sm:text-lg text-grey max-w-xl mx-auto mb-8 leading-relaxed">
            The page you're looking for may have moved or isn't part of our published New Jersey service areas yet.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <SafeLink
              to="/service-areas/new-jersey"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-navy text-white font-semibold hover:bg-navy/90 transition-smooth"
            >
              See all NJ service areas
            </SafeLink>
            <SafeLink
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-navy text-navy font-semibold hover:bg-navy hover:text-white transition-smooth"
            >
              Return home
            </SafeLink>
          </div>
        </section>
      </main>
      <FooterSSR />
    </>
  );
};

export default NotFoundShell;
