import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import QuizFlow from "@/components/quiz/QuizFlow";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Get Your Floor Estimate in 60 Seconds — AXO Floors NJ" },
      { name: "description", content: "Answer 7 quick questions and get a real budget range for your hardwood project. No call required to start. NJ licensed & insured installers." },
      { property: "og:title", content: "Smart Estimate — AXO Floors NJ" },
      { property: "og:url", content: "/quiz" },
    ],
    links: [{ rel: "canonical", href: "/quiz" }],
  }),
  component: Quiz,
});

function Quiz() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--gold-warm)]">Smart Estimate</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-2">
              Get a real budget range — in 60 seconds.
            </h1>
            <p className="text-muted-foreground mt-3">
              7 quick questions. We'll text or call you within 24 hours with next steps.
            </p>
          </div>
          <QuizFlow />
        </div>
      </main>
      <Footer />
    </div>
  );
}
