import { createFileRoute } from "@tanstack/react-router";
import { BlogShell } from "@/components/blog/BlogChrome";
import { PUBLIC_SITE_URL } from "@/lib/constants";

const TITLE = "Privacy Policy | AXO Floors NJ";
const DESC = "How AXO Floors uses website measurement tools, including the Meta pixel for Facebook and Instagram advertising, and how visitors can opt out.";
const URL = `${PUBLIC_SITE_URL}/privacy-policy`;

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:url", content: URL }, { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PrivacyPolicyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-xl font-bold uppercase tracking-[0.08em] text-navy">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-grey">{children}</div>
    </div>
  );
}

function PrivacyPolicyPage() {
  return (
    <BlogShell>
      <section className="bg-navy text-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">AXO Floors NJ</p>
          <h1 className="text-3xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
            How this website measures visits and what you can do about it.
          </p>
          <div className="mt-6 h-1 w-16 bg-gold" />
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-10 md:py-16">
        <Section title="Website measurement">
          <p>
            We measure how people use this website so we can keep it useful and see whether our
            advertising works. We use two tools for this:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Google Analytics 4.</strong> Records page visits and basic usage events
              (for example, starting an estimate request). It is configured without advertising
              personalization and we do not send it your name or contact details.
            </li>
            <li>
              <strong>Meta pixel (Meta Platforms, the company behind Facebook and Instagram).</strong>
              Records page visits and places a cookie (such as <em>_fbp</em>) in your browser so Meta
              can measure visits to this site, help us understand whether our Facebook and Instagram
              ads lead to inquiries, and improve those ads.
            </li>
          </ul>
          <p>
            Neither tool receives the contents of your estimate requests or messages. Those go to us
            directly and are used to respond to your inquiry.
          </p>
        </Section>

        <Section title="Cookies and consent">
          <p>
            These tools use cookies and similar browser storage. In regions where websites must ask
            before using advertising cookies (the European Union, the United Kingdom and
            Switzerland), the Meta pixel stays switched off until we offer a consent choice on this
            site.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can block or delete these cookies at any time in your browser settings. You can also
            control how Meta uses data to personalize ads through your{" "}
            <a
              href="https://www.facebook.com/adpreferences/adsettings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline hover:text-gold"
            >
              Facebook ad preferences
            </a>
            .
          </p>
          <p>
            To ask questions, withdraw consent, or request that we stop measuring your visits, email{" "}
            <a href="mailto:axofloorsnj@gmail.com" className="text-navy underline hover:text-gold">
              axofloorsnj@gmail.com
            </a>{" "}
            or call (732) 351-8653.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            AXO Floors LLC — axofloorsnj@gmail.com — (732) 351-8653.
          </p>
        </Section>
      </section>
    </BlogShell>
  );
}
