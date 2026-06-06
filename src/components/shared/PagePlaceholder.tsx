import { Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL } from "@/lib/constants";

interface Props {
  title: string;
  description: string;
  ctaTo?: string;
  ctaLabel?: string;
  note?: string;
}

export default function PagePlaceholder({ title, description, ctaTo = "/quiz", ctaLabel = "Get Free Estimate", note }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="navy-gradient text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold">{title}</h1>
            <p className="mt-4 text-white/85 max-w-2xl mx-auto">{description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gold-gradient text-navy font-semibold shadow-gold">
                <Link to={ctaTo}>{ctaLabel} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/15">
                <a href={AXO_PHONE_TEL}><Phone className="mr-2 h-4 w-4" /> {AXO_PHONE_DISPLAY}</a>
              </Button>
            </div>
            {note && <p className="mt-6 text-xs text-white/60">{note}</p>}
          </div>
        </section>
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold">Full content coming soon.</h2>
          <p className="text-muted-foreground mt-2">Ready to talk? We respond within 24 hours.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
