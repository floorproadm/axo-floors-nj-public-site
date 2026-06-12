
import { Link } from "react-router-dom";
import {
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  Wind,
  Hammer,
  Users,
  ClipboardCheck,
  Home as HomeIcon,
  Sparkles,
  Wrench,
  Layers,
  Palette,
  Search,
  Shield,
  PaintBucket,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import SEOHead from "@/components/shared/SEOHead";
import LocationStructuredData from "@/components/locations/LocationStructuredData";
import { AXO_PHONE_DISPLAY, AXO_PHONE_TEL, PUBLIC_SITE_URL } from "@/lib/constants";
import { njLocations, type NJLocation } from "@/data/njLocations";
import defaultHeroImage from "@/assets/hardwood-hero.jpg";
import teamPhoto from "@/assets/team-photo.jpg";
import ba1 from "@/assets/before-after/before-after-1.png";
import ba2 from "@/assets/before-after/before-after-2.png";
import ba3 from "@/assets/before-after/before-after-3.png";
import ba4 from "@/assets/before-after/before-after-4.png";
import ba5 from "@/assets/before-after/before-after-5.png";
import ba6 from "@/assets/before-after/before-after-6.png";

interface Props {
  location: NJLocation;
}

const transformationImages = [
  { src: ba1, alt: "AXO Floors hardwood refinishing transformation — before and after" },
  { src: ba2, alt: "Restored red oak hardwood floor by AXO Floors" },
  { src: ba3, alt: "Sand-and-refinish project completed by AXO Floors" },
  { src: ba4, alt: "Hardwood floor restoration — AXO Floors craftsmanship" },
  { src: ba5, alt: "Refinished hardwood with modern stain by AXO Floors" },
  { src: ba6, alt: "Wide-plank hardwood installation by AXO Floors" },
];

// Verified testimonials sourced from the existing AXO Floors homepage.
// Locations preserved as in the source — no city attribution is invented.
const verifiedTestimonials = [
  {
    name: "Michelle Allen",
    text: "Outstanding experience overall! The workmanship was superb, we highly recommend AXO Floors to everyone!",
    location: "Ocean County, NJ",
  },
  {
    name: "Richard Davis",
    text: "We hired AXO Floors and they did amazing work! It was done fast, we had all the work completed. We would highly recommend to anyone! Thank you once again!",
    location: "Monmouth County, NJ",
  },
  {
    name: "David Nakano",
    text: "Professional and quality work! They transformed our home and we couldn't be happier with the results.",
    location: "Middlesex County, NJ",
  },
];

const trustItems = [
  { icon: Users, label: "Family-built craftsmanship" },
  { icon: Hammer, label: "Hands-on project leadership" },
  { icon: Wind, label: "Dust-contained sanding" },
  { icon: ClipboardCheck, label: "Free in-home estimates" },
  { icon: HomeIcon, label: "Installation & refinishing expertise" },
];

const customerProblems = [
  "Worn or dull finish that no longer reflects light evenly",
  "Visible scratches across high-traffic areas",
  "Dark stains, water marks, or pet damage",
  "Damaged or missing boards in isolated sections",
  "Inconsistent flooring between rooms after a renovation",
  "Carpeted stairs that no longer match the hardwood",
  "An outdated stain color you've lived with for years",
  "Floors that need a professional opinion before replacement",
];

const decisionCards = [
  {
    icon: Sparkles,
    title: "Maintenance Recoat",
    bestFor: [
      "Surface wear",
      "Light scratches",
      "Finish that looks dull",
      "Floors without exposed raw wood or deep damage",
    ],
    note: "Eligibility is confirmed during the on-site estimate.",
    href: "/refinishing",
  },
  {
    icon: Layers,
    title: "Full Sanding & Refinishing",
    bestFor: [
      "Widespread scratches",
      "Worn finish",
      "Outdated stain color",
      "Uneven appearance",
      "Floors requiring a complete finish reset",
    ],
    href: "/refinishing",
  },
  {
    icon: Wrench,
    title: "Repairs & Refinishing",
    bestFor: [
      "Damaged boards",
      "Pet-stained sections",
      "Removed walls or altered room layouts",
      "Missing flooring",
      "Areas needing weave-in repair",
    ],
    href: "/refinishing",
  },
  {
    icon: HomeIcon,
    title: "New Hardwood Installation",
    bestFor: [
      "Additions and new rooms",
      "Carpet replacement",
      "Significant floor replacement",
      "Solid or engineered hardwood selection",
    ],
    href: "/installation",
  },
];

const processSteps = [
  { icon: Calendar, title: "In-home evaluation", desc: "We schedule a visit at a time that works for your home." },
  { icon: Search, title: "Floor & project assessment", desc: "Existing finish, board thickness, repairs, transitions, and subfloor are reviewed." },
  { icon: Shield, title: "Preparation & protection", desc: "Work area is contained and protected before any sanding or installation begins." },
  { icon: Hammer, title: "Repairs, sanding, or installation", desc: "Our crew performs the core work using dust-contained equipment." },
  { icon: PaintBucket, title: "Stain & finish application", desc: "Stain samples and finish coats are applied with attention to drying and curing." },
  { icon: CheckCircle2, title: "Final walkthrough & care guidance", desc: "We walk the floor with you and explain how to care for it long-term." },
];

const buildFaq = (cityName: string, custom?: { q: string; a: string }[]) => {
  if (custom && custom.length > 0) return custom;
  return [
    {
      q: `Do you provide hardwood floor estimates in ${cityName}, NJ?`,
      a: `Yes. AXO Floors provides free, no-pressure in-home estimates in ${cityName}. You can request one online or call ${AXO_PHONE_DISPLAY}.`,
    },
    {
      q: "Can my floors be refinished or do they need replacement?",
      a: "It depends on remaining board thickness, the existing finish, and damage. During the estimate we evaluate each room and explain whether refinishing, isolated repair, or replacement is the most appropriate option.",
    },
    {
      q: "Is sanding completely dust-free?",
      a: "No process is 100% dust-free, but we use dust-contained sanding equipment that captures the large majority of dust at the source, keeping your home cleaner during the work.",
    },
    {
      q: "Can engineered hardwood be refinished?",
      a: "Often yes, depending on wear-layer thickness. Thicker wear layers can typically be sanded once or twice; very thin layers may be better suited to a recoat rather than a full sand.",
    },
    {
      q: "Can damaged or pet-stained boards be repaired?",
      a: "Yes. We weave in replacement boards and blend the new pieces with the surrounding floor during sanding and finishing. Severely stained areas are evaluated for repair versus replacement on-site.",
    },
    {
      q: "How long does a typical hardwood project take?",
      a: "Project duration depends on square footage, repairs, stain selection, finish system, and drying and curing requirements. We share a realistic timeline after the on-site assessment.",
    },
    {
      q: "Can I stay in the home during the project?",
      a: "Many homeowners stay in part of the home during the work, but it depends on layout, finish system, and curing time. We discuss living arrangements during the estimate.",
    },
    {
      q: "What is the difference between water-based and oil-based finishes?",
      a: "Water-based finishes tend to be lower-odor and faster to cure, while oil-based finishes have a warmer amber tone and a different cure profile. The right choice depends on wood species, desired appearance, and household use.",
    },
    {
      q: "When can furniture be returned to the room?",
      a: "Light foot traffic is typically possible well before furniture return. Heavy furniture and rugs require longer cure times that depend on the finish system used. We provide specific guidance after final coat.",
    },
    {
      q: "Do you refinish stairs and railings?",
      a: "Yes. We refinish existing stair treads and risers, convert carpeted stairs to hardwood, and work on handrail systems — matched to first-floor stain where appropriate.",
    },
  ];
};

const CityServiceAreaPage = ({ location }: Props) => {
  const path = `/service-areas/new-jersey/${location.slug}`;
  const canonicalUrl = `${PUBLIC_SITE_URL}${path}`;
  const faq = buildFaq(location.cityName, location.localFaqs);

  const robots = location.indexable ? "index, follow" : "noindex, follow";



  const publishedNearby = location.nearbyCitySlugs
    .map((slug) => njLocations.find((l) => l.slug === slug))
    .filter((l): l is NJLocation => !!l && l.published);

  const heroDescription = location.heroDescription ?? location.introduction;
  const heroSrc = location.heroImage ?? defaultHeroImage;
  const localTitle =
    location.localOverviewTitle ?? `Local Flooring Notes for ${location.cityName}`;
  const localBody = location.localOverview ?? location.localFlooringInformation;

  return (
    <>
      <SEOHead
        title={location.metaTitle}
        description={location.metaDescription}
        canonical={canonicalUrl}
        robots={robots}
      />
      <LocationStructuredData location={location} />
      <Header />

      <main className="bg-background">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-grey">
            <li>
              <Link to="/" className="hover:text-navy transition-smooth">Home</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link to="/service-areas/new-jersey" className="hover:text-navy transition-smooth">
                New Jersey Service Areas
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-navy font-medium" aria-current="page">
              {location.cityName}, {location.stateCode}
            </li>
          </ol>
        </nav>

        {/* Hero — premium split layout */}
        <section className="container mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-gold mb-4">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
                  {location.cityName}, {location.stateCode} · {location.county} County
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-heading text-navy leading-[1.1] mb-6">
                {location.h1}
              </h1>
              <p className="text-base sm:text-lg text-grey max-w-xl leading-relaxed mb-8">
                {heroDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90 shadow-elegant">
                  <Link to="/schedule-estimate">
                    <Calendar className="mr-2 h-5 w-5" /> Schedule a Free Estimate
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-navy text-navy hover:bg-navy hover:text-white"
                >
                  <a href={`tel:${AXO_PHONE_TEL}`}>
                    <Phone className="mr-2 h-5 w-5" /> {AXO_PHONE_DISPLAY}
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant border-4 border-gold/20 aspect-[4/3] lg:aspect-[5/4]">
                <img
                  src={heroImage}
                  alt="Refinished hardwood floor by AXO Floors"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-grey-light/50 border-y border-grey-light">
          <div className="container mx-auto px-4 py-6">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-navy">
                  <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-gold/15">
                    <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-snug">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Customer problem section */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-5">
              When Your Floors Stop Matching the Rest of Your Home
            </h2>
            <p className="text-grey leading-relaxed mb-8">
              Hardwood is one of the most visible surfaces in your home. When it stops looking right, the whole room feels older than it is. These are the situations homeowners typically describe when they call us:
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {customerProblems.map((p) => (
              <li key={p} className="flex items-start gap-3 text-grey">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Service decision guide */}
        <section className="bg-grey-light/40 border-y border-grey-light">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
                What Does Your Floor Need?
              </h2>
              <p className="text-grey leading-relaxed">
                Most projects fall into one of four categories. The right path is confirmed in person — but here is how to think about it.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {decisionCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="flex flex-col rounded-xl border border-grey-light bg-card p-6 hover:border-gold hover:shadow-soft transition-smooth"
                  >
                    <div className="w-11 h-11 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-navy" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-navy mb-3">{card.title}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-2">Best for</p>
                    <ul className="space-y-1.5 text-sm text-grey leading-relaxed mb-4">
                      {card.bestFor.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-gold">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {card.note && (
                      <p className="text-xs text-grey/80 italic mb-4">{card.note}</p>
                    )}
                    <Link
                      to={card.href}
                      className="mt-auto inline-flex items-center text-sm font-semibold text-navy hover:text-gold transition-smooth"
                    >
                      Learn more <ChevronRight className="ml-0.5 h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Real project proof */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-3">
                Recent AXO Floors Transformations
              </h2>
              <p className="text-grey leading-relaxed">
                A selection of real refinishing and installation projects completed by AXO Floors. Browse the full set in our gallery.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center text-sm font-semibold text-navy hover:text-gold transition-smooth"
            >
              View full gallery <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {transformationImages.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl aspect-[4/3] bg-grey-light"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Family & craftsmanship story */}
        <section className="bg-black text-white">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="rounded-2xl overflow-hidden border-4 border-gold/20 shadow-elegant aspect-[4/5] max-w-md mx-auto lg:mx-0">
                <img
                  src={teamPhoto}
                  alt="Ademir and Eduardo — AXO Floors family team"
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-5">
                  A Flooring Company Built from the <span className="text-gold">Jobsite Up</span>
                </h2>
                <p className="text-white/85 leading-relaxed mb-4">
                  AXO Floors is led by Ademir and his son Eduardo — a father-and-son team that built the company hands-on, one floor at a time. Ademir leads with more than 15 years of sanding, refinishing, and installation experience. Eduardo guides homeowners through stain colors, finish systems, and project decisions so the result lines up with what they actually want.
                </p>
                <p className="text-white/85 leading-relaxed mb-6">
                  Because the owners are on the work, decisions about preparation, repair, stain, and finish are made by people who do the work — not handed off. That is the difference our clients describe most often.
                </p>
                <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  <Link to="/about">Read the full AXO Floors story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Technical process */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
              What to Expect from Your Flooring Project
            </h2>
            <p className="text-grey leading-relaxed">
              Every project moves through the same six phases. Exact steps and timelines depend on square footage, floor condition, repairs, installation requirements, stain selection, finish system, and drying and curing requirements.
            </p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.title}
                  className="rounded-xl border border-grey-light bg-card p-6 hover:border-gold transition-smooth"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-bold font-heading text-navy/15">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-navy text-lg mb-1.5">{s.title}</h3>
                  <p className="text-sm text-grey leading-relaxed">{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Finish & design guidance */}
        <section className="bg-grey-light/40 border-y border-grey-light">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
                Choosing the Right Color, Sheen, and Finish
              </h2>
              <p className="text-grey leading-relaxed">
                There is no single best finish for every home. The right combination depends on wood species, existing coatings, desired appearance, household use, project conditions, and curing expectations. We review options with you during the estimate.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Palette,
                  title: "Color: natural vs. stained",
                  body: "Natural floors highlight the wood's own tone. Stains shift the color — warmer, deeper, lighter, or grey — and the species of wood affects how stain takes.",
                },
                {
                  icon: Sparkles,
                  title: "Sheen: matte to higher gloss",
                  body: "Matte and satin finishes hide minor wear and feel modern. Higher-sheen options show more light and depth but also more imperfection.",
                },
                {
                  icon: Shield,
                  title: "Water-based vs. oil-based",
                  body: "Water-based systems cure faster and have lower odor. Oil-based systems offer a warmer amber tone and a different cure profile. Either may be appropriate depending on the project.",
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="rounded-xl border border-grey-light bg-card p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-navy" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-semibold text-navy text-lg mb-2">{c.title}</h3>
                    <p className="text-sm text-grey leading-relaxed">{c.body}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-grey mt-8 max-w-3xl">
              We recommend evaluating physical stain and finish samples on your floor before committing. Lighting, surrounding rooms, and existing trim all change how the final color reads.
            </p>
          </div>
        </section>

        {/* Local section */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-5">
                {localTitle}
              </h2>
              <p className="text-grey leading-relaxed mb-4">{localBody}</p>
              {location.coastalNote && (
                <p className="text-grey leading-relaxed">{location.coastalNote}</p>
              )}
            </div>
            <aside className="space-y-6">
              {location.neighborhoods.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-3">
                    Areas Served
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {location.neighborhoods.map((n) => (
                      <li
                        key={n}
                        className="text-sm px-3 py-1.5 rounded-full bg-grey-light/60 text-navy"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {location.zipCodes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-3">
                    ZIP Codes
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {location.zipCodes.map((z) => (
                      <li
                        key={z}
                        className="text-sm px-3 py-1.5 rounded-full bg-grey-light/60 text-navy font-mono"
                      >
                        {z}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-grey-light/40 border-y border-grey-light">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-3">
                What Homeowners Say About AXO Floors
              </h2>
              <p className="text-grey leading-relaxed">
                A few of the reviews from the AXO Floors site. Locations are shown exactly as published.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {verifiedTestimonials.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-xl border border-grey-light bg-card p-6 flex flex-col"
                >
                  <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-grey leading-relaxed flex-1">
                    "{t.text}"
                  </blockquote>
                  <figcaption className="mt-4 pt-4 border-t border-grey-light/70">
                    <p className="font-semibold text-navy">{t.name}</p>
                    <p className="text-xs text-grey">{t.location}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby cities */}
        {publishedNearby.length > 0 && (
          <section className="container mx-auto px-4 py-14 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-navy mb-6">
              Nearby Areas We Serve
            </h2>
            <ul className="flex flex-wrap gap-3">
              {publishedNearby.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/service-areas/new-jersey/${c.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-grey-light text-navy font-medium hover:border-gold hover:bg-grey-light/30 transition-smooth"
                  >
                    {c.cityName}, {c.stateCode}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-navy mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-navy font-semibold text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-grey leading-relaxed text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="rounded-2xl bg-navy text-white p-8 md:p-14 text-center shadow-elegant">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Ready to See What Your Floors Can Become?
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-8 leading-relaxed">
              Schedule an in-home estimate so AXO Floors can review your floor condition, discuss your goals, and recommend the right next step.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                <Link to="/schedule-estimate">
                  <Calendar className="mr-2 h-5 w-5" /> Schedule a Free Estimate
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white hover:text-navy"
              >
                <a href={`tel:${AXO_PHONE_TEL}`}>
                  <Phone className="mr-2 h-5 w-5" /> {AXO_PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CityServiceAreaPage;
