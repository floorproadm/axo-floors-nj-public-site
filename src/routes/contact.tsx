import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ContactForm from "@/components/shared/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageSquare, Star } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL, AXO_EMAIL } from "@/lib/constants";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AXO Floors NJ — Free Estimate" },
      { name: "description", content: "Reach AXO Floors for a free in-home consultation. Same-day quotes. Call (732) 351-8653 or email axofloorsnj@gmail.com." },
      { property: "og:title", content: "Contact AXO Floors NJ" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="navy-gradient text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold">Let's talk about your floors.</h1>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">Free in-home consultation & same-day quotes. Licensed, insured, bonded.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <aside className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <a href={AXO_PHONE_TEL} className="flex items-center gap-3 hover:text-[var(--gold-warm)]">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Call us</p>
                    <p className="font-semibold">{AXO_PHONE_DISPLAY}</p>
                  </div>
                </a>
                <a href={`mailto:${AXO_EMAIL}`} className="flex items-center gap-3 hover:text-[var(--gold-warm)]">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold">{AXO_EMAIL}</p>
                  </div>
                </a>
                <a href={`sms:${AXO_PHONE_DISPLAY}`} className="flex items-center gap-3 hover:text-[var(--gold-warm)]">
                  <MessageSquare className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Text</p>
                    <p className="font-semibold">{AXO_PHONE_DISPLAY}</p>
                  </div>
                </a>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-none">
              <CardContent className="p-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[var(--gold-warm)] text-[var(--gold-warm)]" />
                  ))}
                </div>
                <p className="text-sm mt-3 italic">"Eduardo gave me a quote the same day, finished my project in 3 days, and saved me $3,200 vs. replacement. Amazing team!"</p>
                <p className="text-xs font-semibold mt-2 text-muted-foreground">— Laura M., NJ</p>
              </CardContent>
            </Card>
            <ul className="text-sm space-y-2 px-2 text-muted-foreground">
              <li>✓ Free in-home consultation & same-day quotes</li>
              <li>✓ Licensed, insured, bonded professionals</li>
              <li>✓ Average project: 3–5 days</li>
              <li>✓ Save up to 40% vs. replacement</li>
            </ul>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
