import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink, MessageCircle, Phone, Gift } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/CW2mOYkIlVC-EAE/review";
const HOUZZ_URL = "https://www.houzz.com/pro/axofloors";
const FACEBOOK_URL = "https://www.facebook.com/axofloors/reviews";
const EDUARDO_PHONE = "(862) 218-4496";

export const Route = createFileRoute("/review-request")({
  head: () => ({ meta: [{ title: "Leave a Review | AXO Floors NJ" }, { name: "robots", content: "noindex" }] }),
  component: ReviewRequest,
});

function ReviewRequest() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/40">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-6">
            <Gift className="h-12 w-12 mx-auto text-[var(--gold-warm)]" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-3">Thank you for choosing AXO!</h1>
            <p className="text-muted-foreground mt-2">Your honest review helps other families find us. It takes 30 seconds.</p>
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-[var(--gold-warm)] text-[var(--gold-warm)]" />
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Button asChild className="h-auto py-4 gold-gradient text-navy font-semibold">
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" /> Google
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <a href={HOUZZ_URL} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-4 w-4" /> Houzz</a>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4">
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-4 w-4" /> Facebook</a>
            </Button>
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="font-heading font-bold">Got before & after photos?</h2>
              <p className="text-sm text-muted-foreground mt-1">Text them to Eduardo and we'll feature your transformation.</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <Button asChild variant="outline">
                  <a href={`sms:${EDUARDO_PHONE}?body=Hi%20Eduardo!%20Here%20are%20my%20before%20%26%20after%20photos!`}>
                    <MessageCircle className="mr-2 h-4 w-4" /> Text photos
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={`tel:${EDUARDO_PHONE}`}><Phone className="mr-2 h-4 w-4" /> Call {EDUARDO_PHONE}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
