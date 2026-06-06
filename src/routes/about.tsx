import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AXO Floors — A Father-and-Son Team in NJ" },
      { name: "description", content: "Ademir and Eduardo built AXO Floors with their hands and reputation. 15+ years serving NJ, NY, and PA." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const team = [
  { name: "Ademir", role: "Owner", bio: "With over 15 years serving NJ, NY, and PA, Ademir built AXO Floors with his hands and reputation. Known for precision sanding and installations, his commitment is simple: do it once, do it right." },
  { name: "Eduardo", role: "General Manager", bio: "Following in his father's footsteps, Eduardo has nearly a decade of experience in the hardwood flooring industry, proudly serving homeowners across NJ, NY, and PA. He guides clients through every decision — from stain colors to finish options." },
];

const stats = [
  { icon: Users, value: "500+", label: "Projects Completed" },
  { icon: Clock, value: "10+", label: "Years Experience" },
  { icon: Award, value: "100%", label: "Satisfaction Rate" },
];

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="navy-gradient text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold-accent)]">About AXO Floors</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold mt-3">A father, a son, and a craft.</h1>
            <p className="mt-4 text-white/85 max-w-2xl mx-auto">
              AXO Floors is more than a family business — it's our name on every floor we touch.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-6 text-center">
                  <s.icon className="h-7 w-7 mx-auto text-[var(--gold-warm)]" />
                  <p className="font-heading text-3xl font-extrabold mt-2">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-secondary">
          <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 max-w-5xl">
            {team.map((p) => (
              <Card key={p.name}>
                <CardContent className="p-6">
                  <h2 className="font-heading text-2xl font-bold">{p.name}</h2>
                  <p className="text-sm font-semibold text-[var(--gold-warm)]">{p.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-heading text-2xl font-bold">Ready to see what we can do?</h2>
          <Button asChild size="lg" className="mt-6 gold-gradient text-navy font-semibold">
            <Link to="/quiz">Start your estimate <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
