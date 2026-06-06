import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, ArrowRight, Gift } from "lucide-react";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL, AXO_EMAIL } from "@/lib/constants";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Estimate Received — We'll Call Within 24h | AXO Floors NJ" },
      { name: "description", content: "Thanks! A senior estimator will reach out within 24 hours." },
      { property: "og:url", content: "/thank-you" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/40">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-navy" />
              </div>
              <CardTitle className="font-heading text-3xl mt-4">You're all set.</CardTitle>
              <p className="text-muted-foreground mt-2">A senior estimator will reach out within 24 hours.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-auto py-4">
                  <a href={AXO_PHONE_TEL} className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Need to talk now?</span>
                    <span className="font-semibold inline-flex items-center gap-2"><Phone className="h-4 w-4" />{AXO_PHONE_DISPLAY}</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4">
                  <a href={`mailto:${AXO_EMAIL}`} className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Email us</span>
                    <span className="font-semibold inline-flex items-center gap-2"><Mail className="h-4 w-4" />{AXO_EMAIL}</span>
                  </a>
                </Button>
              </div>

              <div className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/10 p-5 mt-4">
                <div className="flex gap-3">
                  <Gift className="h-6 w-6 text-[var(--gold-warm)] shrink-0" />
                  <div>
                    <h3 className="font-heading font-bold">Earn $100 for every referral.</h3>
                    <p className="text-sm text-muted-foreground mt-1">Know someone with worn floors? Send them our way and we'll thank you with a $100 gift card.</p>
                    <Button asChild size="sm" className="mt-3 gold-gradient text-navy font-semibold">
                      <Link to="/referral-program">Learn more <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
