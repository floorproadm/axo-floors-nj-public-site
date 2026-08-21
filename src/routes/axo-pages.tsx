import { createFileRoute, Link } from "@tanstack/react-router";
import { njLocations } from "@/data/njLocations";
import { Layout } from "lucide-react";

export const Route = createFileRoute("/axo-pages")({
  component: AxoPages,
});

function AxoPages() {
  const mainPages = [
    { name: "Home", path: "/" },
    { name: "Installation", path: "/installation" },
    { name: "Refinishing", path: "/refinishing" },
    { name: "Vinyl Plank", path: "/vinyl-plank-flooring" },
    { name: "Staircase", path: "/staircase" },
    { name: "Base Boards", path: "/base-boards" },
    { name: "Gallery", path: "/gallery" },
    { name: "Stain Gallery", path: "/stain-gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Quiz", path: "/quiz" },
    { name: "Get Started", path: "/get-started" },
    { name: "Schedule", path: "/schedule-estimate" },
    { name: "Builders", path: "/builders" },
    { name: "Realtors", path: "/realtors" },
    { name: "Partner Prog.", path: "/partner-program" },
    { name: "Referral Prog.", path: "/referral-program" },
    { name: "Wow Pack", path: "/wow-pack" },
    { name: "Review Req.", path: "/review-request" },
    { name: "Hub (Links)", path: "/hub" },
    { name: "Campaign", path: "/campaign" },
    { name: "Master Sys.", path: "/axo-master-system" },
  ];

  const cityPages = njLocations
    .filter((loc) => loc.published)
    .sort((a, b) => a.cityName.localeCompare(b.cityName));

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 flex items-center gap-4">
          <div className="rounded-xl bg-[#001D3D] p-3 text-[#FFD700]">
            <Layout size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#001D3D]">
              {"'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n                                        \n                                            \n                                            Quero criar uma page /axo-pages ela sera uma forma de eu ter facil acesso a todas pages / criadas"}
            </h1>
            <p className="whitespace-pre-wrap text-slate-600">Quick access to all project routes and landing pages.</p>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="mb-6 border-b pb-2 text-xl font-semibold text-[#001D3D]">Core Site Pages</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {mainPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="flex items-center rounded-lg border bg-white p-4 transition-all hover:border-[#FFD700] hover:shadow-md"
              >
                <span className="font-medium text-[#001D3D]">{page.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold text-[#001D3D]">Service Area Pages (Local SEO)</h2>
            <Link to="/service-areas/new-jersey" className="text-sm font-medium text-[#FFD700] hover:underline">
              View NJ Hub →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cityPages.map((city) => (
              <Link
                key={city.slug}
                to="/service-areas/new-jersey/$slug"
                params={{ slug: city.slug }}
                className="rounded-lg border bg-white p-3 text-sm transition-all hover:border-[#FFD700] hover:shadow-md"
              >
                <div className="font-medium text-[#001D3D]">{city.cityName}</div>
                <div className="text-xs text-slate-500">{city.indexable ? "● Indexable" : "○ Published (QA)"}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-b pb-2 text-xl font-semibold text-[#001D3D]">Dynamic & Token Routes</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-slate-100 p-4">
              <span className="text-sm font-bold text-[#001D3D]">Estimate/Invoice Public Pages</span>
              <p className="mt-1 text-xs text-slate-600 italic">
                These require tokens (e.g., /estimate/123). Check Supabase admin for valid tokens.
              </p>
            </div>
          </div>
        </section>
        
        <footer className="mt-20 border-t pt-8 text-center text-xs text-slate-400">
          AXO Floors NJ Internal Navigation Index
        </footer>
      </div>
    </div>
  );
}
