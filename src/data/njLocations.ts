// Programmatic local-SEO dataset for AXO Floors NJ.
// Add the remaining 540+ NJ municipalities here (or import from CSV/JSON)
// using the same shape — no new page components required.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProjectGalleryItem {
  title: string;
  description: string;
  image?: string; // optional — falls back to shared gallery assets
}

export interface NJLocation {
  cityName: string;
  slug: string;                // url-safe, e.g. "red-bank"
  county: string;              // e.g. "Monmouth"
  countySlug: string;          // e.g. "monmouth"
  state: string;               // "New Jersey"
  stateCode: string;           // "NJ"
  zipCodes: string[];
  neighborhoods: string[];
  nearbyCities: string[];      // slugs of nearby published cities
  metaTitle: string;           // <60 chars target
  metaDescription: string;     // <160 chars target
  h1: string;
  introduction: string;        // 1–2 paragraphs, city-specific
  localFlooringInformation: string; // longer body, mentions architecture / housing stock
  projectGallery: ProjectGalleryItem[];
  testimonial?: {
    quote: string;
    author: string;
    location: string;
  };
  faq: FaqItem[];
  published: boolean;
  indexable: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────
const monmouthFaq = (city: string): FaqItem[] => [
  {
    question: `Do you serve all of ${city}, NJ?`,
    answer: `Yes — AXO Floors provides hardwood installation, sanding, refinishing, staircase work and floor repairs to every neighborhood and ZIP code in ${city}. Estimates are free and on-site.`,
  },
  {
    question: `How long does a hardwood refinishing project take in ${city}?`,
    answer: `Most ${city} homes are completed in 3–5 business days, depending on square footage, stain color and how many coats of finish you choose. We confirm the exact schedule during your free estimate.`,
  },
  {
    question: `What does hardwood flooring cost in ${city}?`,
    answer: `Pricing in ${city} depends on species, grade, subfloor condition and finish. Refinishing typically starts around $3.50/sq ft and new installations around $8/sq ft. Use our Smart Estimate quiz for a personalized range, then book a free in-home estimate.`,
  },
  {
    question: "Are you licensed and insured in New Jersey?",
    answer: "Yes. AXO Floors is fully licensed and insured in the State of New Jersey, with workers' compensation and general liability coverage on every job.",
  },
];

const standardGallery = (city: string): ProjectGalleryItem[] => [
  {
    title: `Red oak refinish — ${city}`,
    description: `Full sand-and-refinish on 1,100 sq ft of red oak, finished with a satin water-based topcoat. Completed in 4 days with zero dust thanks to our containment system.`,
  },
  {
    title: `New white oak installation — ${city}`,
    description: `Wide-plank rift-and-quartered white oak installed over a leveled plywood subfloor, with custom transitions to tile in the kitchen and bathrooms.`,
  },
  {
    title: `Staircase rebuild — ${city}`,
    description: `Carpeted stairs converted to solid oak treads with painted risers and a new handrail system, matched to the existing first-floor stain.`,
  },
];

// ─── Seed data (20 cities) ─────────────────────────────────────────────
export const njLocations: NJLocation[] = [
  {
    cityName: "Long Branch",
    slug: "long-branch",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07740"],
    neighborhoods: ["Elberon", "West End", "North Long Branch", "Pleasure Bay", "Branchport"],
    nearbyCities: ["west-long-branch", "oceanport", "eatontown", "oakhurst", "asbury-park"],
    metaTitle: "Hardwood Flooring in Long Branch, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding & refinishing in Long Branch, NJ. Dust-contained service, licensed & insured. Free estimates — call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Long Branch, NJ",
    introduction:
      "AXO Floors is a Long Branch-based hardwood flooring contractor serving homeowners from Elberon down to Pleasure Bay. From oceanfront condos that need a salt-air-ready finish to classic Victorian homes near the West End, we deliver clean, professional installs, sandings and repairs with zero shortcuts.",
    localFlooringInformation:
      "Long Branch's housing stock ranges from early-1900s shore homes with original red oak strip flooring to modern high-rise condos on Ocean Avenue. Salt air, humidity swings and frequent foot traffic mean shore-area floors typically need refinishing every 8–12 years. We recommend hard-wax oils or commercial-grade water-based finishes for oceanfront properties because they handle humidity better than older oil-based polys and recoat cleanly without a full sand.",
    projectGallery: standardGallery("Long Branch"),
    testimonial: {
      quote: "They refinished the original oak in our 1920s Elberon home and matched a custom stain perfectly. Dust containment actually worked — kitchen was usable the next day.",
      author: "Jessica R.",
      location: "Elberon, Long Branch",
    },
    faq: monmouthFaq("Long Branch"),
    published: true,
    indexable: true,
  },
  {
    cityName: "West Long Branch",
    slug: "west-long-branch",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07764"],
    neighborhoods: ["Monmouth University area", "Franklin Lake", "Cedar Avenue"],
    nearbyCities: ["long-branch", "oakhurst", "eatontown", "oceanport"],
    metaTitle: "Hardwood Flooring in West Long Branch, NJ | AXO Floors",
    metaDescription: "Professional hardwood installation, refinishing and stair work in West Long Branch, NJ. Free in-home estimates — call (732) 351-8653.",
    h1: "Hardwood Flooring Services in West Long Branch, NJ",
    introduction:
      "Serving West Long Branch and the Monmouth University neighborhood with hardwood installation, sanding and refinishing, plus staircase and trim work. Free estimates, fully licensed and insured.",
    localFlooringInformation:
      "Many West Long Branch homes are mid-century colonials and split-levels with original red oak that responds beautifully to a modern refinish. We see a lot of requests for natural and lightly stained finishes that complement the borough's open-floor-plan renovations.",
    projectGallery: standardGallery("West Long Branch"),
    faq: monmouthFaq("West Long Branch"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Oakhurst",
    slug: "oakhurst",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07755"],
    neighborhoods: ["Wanamassa border", "Deal Park"],
    nearbyCities: ["long-branch", "west-long-branch", "asbury-park", "eatontown"],
    metaTitle: "Hardwood Flooring in Oakhurst, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand & refinish in Oakhurst (Ocean Township), NJ. Dust-contained, licensed & insured. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Oakhurst, NJ",
    introduction:
      "AXO Floors serves Oakhurst and the surrounding Ocean Township area with full-service hardwood flooring — installations, sand-and-refinish, and repairs done with respect for your home.",
    localFlooringInformation:
      "Oakhurst homes commonly feature 2¼\" red oak strip flooring from the 1950s–70s. These floors usually have several sandings of life left and refinish beautifully with modern water-based finishes that are low-odor and dry fast.",
    projectGallery: standardGallery("Oakhurst"),
    faq: monmouthFaq("Oakhurst"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Oceanport",
    slug: "oceanport",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07757"],
    neighborhoods: ["Port-au-Peck", "Pleasure Bay", "Little Silver Point"],
    nearbyCities: ["long-branch", "little-silver", "fair-haven", "rumson"],
    metaTitle: "Hardwood Flooring in Oceanport, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding & refinishing in Oceanport, NJ. Free on-site estimates — call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Oceanport, NJ",
    introduction:
      "AXO Floors works throughout Oceanport — from Port-au-Peck to Pleasure Bay — installing and refinishing hardwood floors with a clean, contained process.",
    localFlooringInformation:
      "Oceanport's waterfront homes deal with consistent humidity. We recommend pre-finished engineered hardwood for slab-on-grade additions and solid white oak with moisture-tolerant finishes for the main living areas.",
    projectGallery: standardGallery("Oceanport"),
    faq: monmouthFaq("Oceanport"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Eatontown",
    slug: "eatontown",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724"],
    neighborhoods: ["Wampum Lake", "Wyckoff Road corridor"],
    nearbyCities: ["tinton-falls", "long-branch", "west-long-branch", "oakhurst"],
    metaTitle: "Hardwood Flooring in Eatontown, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, stairs & repairs in Eatontown, NJ. Licensed & insured. Free estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Eatontown, NJ",
    introduction:
      "AXO Floors provides hardwood installation, refinishing and staircase work throughout Eatontown — from older colonials near Wampum Lake to newer townhomes along Wyckoff Road.",
    localFlooringInformation:
      "Eatontown has a mix of ranches and colonials from the 1960s–80s, plus newer construction with engineered hardwood. We handle both site-finished solid hardwood and pre-finished installations, including full subfloor leveling when needed.",
    projectGallery: standardGallery("Eatontown"),
    faq: monmouthFaq("Eatontown"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Tinton Falls",
    slug: "tinton-falls",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724", "07753", "07712"],
    neighborhoods: ["Hance Park", "Shark River Hills border", "Wayside"],
    nearbyCities: ["eatontown", "asbury-park", "shrewsbury", "red-bank"],
    metaTitle: "Hardwood Flooring in Tinton Falls, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand & refinish, stairs and repairs in Tinton Falls, NJ. Free in-home estimates — call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Tinton Falls, NJ",
    introduction:
      "AXO Floors serves Tinton Falls homeowners with hardwood installation, sanding, refinishing and staircase work — from active-adult communities to single-family colonials.",
    localFlooringInformation:
      "Newer Tinton Falls developments often have engineered hardwood that can be refinished once or twice depending on wear-layer thickness. We assess wear layer before quoting and recommend buff-and-recoat as an affordable alternative when appropriate.",
    projectGallery: standardGallery("Tinton Falls"),
    faq: monmouthFaq("Tinton Falls"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Red Bank",
    slug: "red-bank",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07701"],
    neighborhoods: ["West Side", "East Side", "Riverside Gardens", "Broad Street"],
    nearbyCities: ["fair-haven", "little-silver", "shrewsbury", "rumson", "middletown"],
    metaTitle: "Hardwood Flooring in Red Bank, NJ | AXO Floors",
    metaDescription: "Premium hardwood installation and refinishing in Red Bank, NJ. Victorian restorations, modern finishes. Free estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Red Bank, NJ",
    introduction:
      "Red Bank's historic homes deserve craftsmanship. AXO Floors specializes in restoring original hardwood in Victorian and early-1900s homes throughout the West Side, plus modern installations in renovated downtown lofts and condos.",
    localFlooringInformation:
      "Many Red Bank homes have original 2¼\" red or white oak — sometimes with intricate borders or parquet medallions in the entry. We work carefully around original detail, can weave-in matching boards for repairs, and offer custom stain matching for period-correct restorations.",
    projectGallery: standardGallery("Red Bank"),
    testimonial: {
      quote: "AXO restored the original oak in our 1898 West Side Victorian. They wove in new boards seamlessly where a wall had been removed. Incredible work.",
      author: "Daniel & Marie K.",
      location: "West Side, Red Bank",
    },
    faq: monmouthFaq("Red Bank"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Rumson",
    slug: "rumson",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07760"],
    neighborhoods: ["Rumson Road corridor", "Bingham Avenue", "Sea Bright border"],
    nearbyCities: ["fair-haven", "little-silver", "red-bank", "oceanport"],
    metaTitle: "Hardwood Flooring in Rumson, NJ | AXO Floors",
    metaDescription: "High-end hardwood installation and refinishing in Rumson, NJ. Custom stains, wide-plank white oak, staircases. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Rumson, NJ",
    introduction:
      "AXO Floors is trusted by Rumson homeowners and builders for high-end hardwood installations and meticulous refinishes — including wide-plank white oak, custom stains and full staircase rebuilds.",
    localFlooringInformation:
      "Rumson estates often feature rift-and-quartered white oak in widths from 6\" to 10\", with custom stain blends. We install Bona, Rubio Monocoat and Pallmann finish systems and can match any stain — including the popular warm, fumed and natural-matte looks currently in demand on Rumson Road.",
    projectGallery: standardGallery("Rumson"),
    faq: monmouthFaq("Rumson"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Fair Haven",
    slug: "fair-haven",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07704"],
    neighborhoods: ["River Road", "Fair Haven Fields"],
    nearbyCities: ["red-bank", "rumson", "little-silver", "middletown"],
    metaTitle: "Hardwood Flooring in Fair Haven, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand & refinish in Fair Haven, NJ. Family-owned, licensed & insured. Free estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Fair Haven, NJ",
    introduction:
      "AXO Floors serves Fair Haven families with hardwood installations, refinishing and staircase work — handling everything from older River Road homes to recent renovations near Fair Haven Fields.",
    localFlooringInformation:
      "Fair Haven's mature housing stock means many homes have original oak that has been refinished a few times already. We measure remaining board thickness before sanding and recommend recoat-only work when a full sand isn't safe.",
    projectGallery: standardGallery("Fair Haven"),
    faq: monmouthFaq("Fair Haven"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Little Silver",
    slug: "little-silver",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07739"],
    neighborhoods: ["Markham Place", "Parker Avenue", "Borough Center"],
    nearbyCities: ["red-bank", "shrewsbury", "fair-haven", "oceanport"],
    metaTitle: "Hardwood Flooring in Little Silver, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and stair work in Little Silver, NJ. Free in-home estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Little Silver, NJ",
    introduction:
      "Little Silver homeowners trust AXO Floors for hardwood installations, sand-and-refinish, and staircase work — done cleanly with respect for your schedule and home.",
    localFlooringInformation:
      "Little Silver's classic colonials and capes typically have 2¼\" or 3¼\" oak strip flooring. We refinish these with modern low-VOC water-based finishes that cure faster and dry harder than oil-based finishes from a decade ago.",
    projectGallery: standardGallery("Little Silver"),
    faq: monmouthFaq("Little Silver"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Shrewsbury",
    slug: "shrewsbury",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07702"],
    neighborhoods: ["Broad Street", "Sycamore Avenue", "Shrewsbury Township border"],
    nearbyCities: ["red-bank", "tinton-falls", "little-silver", "eatontown"],
    metaTitle: "Hardwood Flooring in Shrewsbury, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand & refinish and stairs in Shrewsbury, NJ. Licensed & insured. Free estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Shrewsbury, NJ",
    introduction:
      "AXO Floors serves Shrewsbury Borough with hardwood installations, refinishing, repairs and staircase work — clean process, clear pricing, no surprises.",
    localFlooringInformation:
      "Shrewsbury homes blend historic colonials with newer construction along Sycamore Avenue. We handle both — restoring original heart-pine and oak floors as well as installing new wide-plank engineered systems.",
    projectGallery: standardGallery("Shrewsbury"),
    faq: monmouthFaq("Shrewsbury"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Middletown",
    slug: "middletown",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07748", "07701", "07757", "07758"],
    neighborhoods: ["Lincroft", "Belford", "Port Monmouth", "Leonardo", "Navesink", "River Plaza"],
    nearbyCities: ["holmdel", "red-bank", "fair-haven", "colts-neck"],
    metaTitle: "Hardwood Flooring in Middletown, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing and stair rebuilds in Middletown Township, NJ. Lincroft, Belford, Leonardo. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Middletown, NJ",
    introduction:
      "Middletown Township is one of AXO Floors' largest service areas in Monmouth County. We work in every neighborhood — Lincroft, Belford, Port Monmouth, Leonardo, Navesink and River Plaza — installing, refinishing and repairing hardwood floors.",
    localFlooringInformation:
      "Middletown's range — from 1700s historic homes near Navesink to mid-century ranches in Lincroft to new construction — means we see every type of hardwood. We're equipped for hand-scraping, custom stain matching, board weaving and large-scale whole-home installations.",
    projectGallery: standardGallery("Middletown"),
    faq: monmouthFaq("Middletown"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Holmdel",
    slug: "holmdel",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07733"],
    neighborhoods: ["Holmdel Village", "Crawfords Corner", "Telegraph Hill"],
    nearbyCities: ["colts-neck", "middletown", "red-bank", "freehold"],
    metaTitle: "Hardwood Flooring in Holmdel, NJ | AXO Floors",
    metaDescription: "Premium hardwood install and refinishing in Holmdel, NJ. Wide-plank white oak, custom stains, staircases. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Holmdel, NJ",
    introduction:
      "AXO Floors works with Holmdel homeowners and builders on premium hardwood installations and refinishes — including wide-plank white oak, custom-stained walnut, and full staircase rebuilds.",
    localFlooringInformation:
      "Holmdel's larger estate homes often feature site-finished hardwood across 3,000+ sq ft. We're set up for whole-home jobs with full dust containment, multi-day stain testing on site, and finish schedules that align with your move-in timeline.",
    projectGallery: standardGallery("Holmdel"),
    faq: monmouthFaq("Holmdel"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Colts Neck",
    slug: "colts-neck",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07722"],
    neighborhoods: ["Route 537 corridor", "Five Points"],
    nearbyCities: ["holmdel", "freehold", "middletown", "red-bank"],
    metaTitle: "Hardwood Flooring in Colts Neck, NJ | AXO Floors",
    metaDescription: "Custom hardwood install and refinishing in Colts Neck, NJ. Estate homes, wide-plank white oak, custom stains. (732) 351-8653.",
    h1: "Hardwood Flooring Services in Colts Neck, NJ",
    introduction:
      "AXO Floors serves Colts Neck estate homes with custom hardwood installations and meticulous refinishes — including wide-plank white oak, walnut, and hand-scraped reclaimed boards.",
    localFlooringInformation:
      "Colts Neck homes often have radiant heat under hardwood. We use moisture-tolerant engineered systems engineered for radiant subfloors and follow NWFA installation guidelines, including in-floor moisture readings before and after install.",
    projectGallery: standardGallery("Colts Neck"),
    faq: monmouthFaq("Colts Neck"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Freehold",
    slug: "freehold",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07728"],
    neighborhoods: ["Downtown Freehold", "Freehold Township", "West Freehold"],
    nearbyCities: ["colts-neck", "holmdel", "manasquan"],
    metaTitle: "Hardwood Flooring in Freehold, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and stairs in Freehold, NJ. Downtown historic homes and Freehold Township new builds. (732) 351-8653.",
    h1: "Hardwood Flooring Services in Freehold, NJ",
    introduction:
      "From downtown Freehold Borough's historic homes to Freehold Township's newer developments, AXO Floors installs, refinishes and repairs hardwood floors with a professional, dust-contained process.",
    localFlooringInformation:
      "Downtown Freehold's older homes often feature heart-pine subfloors and original oak. We can refinish, weave-in repair boards, or install over existing flooring in renovation projects — all matched to your home's character.",
    projectGallery: standardGallery("Freehold"),
    faq: monmouthFaq("Freehold"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Asbury Park",
    slug: "asbury-park",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07712"],
    neighborhoods: ["North Beach", "West Side", "Ocean Grove border", "Wesley Lake"],
    nearbyCities: ["belmar", "oakhurst", "tinton-falls", "long-branch"],
    metaTitle: "Hardwood Flooring in Asbury Park, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and restoration in Asbury Park, NJ. Victorian and shore-home specialists. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Asbury Park, NJ",
    introduction:
      "Asbury Park's Victorian-era homes and modern downtown condos all benefit from AXO Floors' craftsmanship — original-floor restorations, new installations, and complete staircase rebuilds.",
    localFlooringInformation:
      "Asbury Park homes often have original 1890s–1920s flooring — heart pine, narrow-strip oak, and sometimes maple. These floors are typically thinner than modern hardwood, so we use lighter-grit sanding sequences and hard-wax oil finishes that protect without removing too much wood.",
    projectGallery: standardGallery("Asbury Park"),
    faq: monmouthFaq("Asbury Park"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Belmar",
    slug: "belmar",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07719"],
    neighborhoods: ["Belmar Beach", "Silver Lake", "Maclearie Park"],
    nearbyCities: ["manasquan", "asbury-park", "point-pleasant"],
    metaTitle: "Hardwood Flooring in Belmar, NJ | AXO Floors",
    metaDescription: "Shore-home hardwood install and refinishing in Belmar, NJ. Moisture-tolerant finishes for beach properties. (732) 351-8653.",
    h1: "Hardwood Flooring Services in Belmar, NJ",
    introduction:
      "AXO Floors specializes in Belmar's mix of shore homes, rentals and year-round residences — using moisture-tolerant finishes and durable installations built for beachfront conditions.",
    localFlooringInformation:
      "Belmar's coastal humidity means hardwood floors expand and contract more than inland homes. We acclimate flooring on-site for 5–7 days before installation and recommend engineered systems for slab-on-grade additions near the beach.",
    projectGallery: standardGallery("Belmar"),
    faq: monmouthFaq("Belmar"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Manasquan",
    slug: "manasquan",
    county: "Monmouth",
    countySlug: "monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08736"],
    neighborhoods: ["Manasquan Beach", "Squan Village", "Stockton Lake"],
    nearbyCities: ["belmar", "point-pleasant", "freehold"],
    metaTitle: "Hardwood Flooring in Manasquan, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and stair work in Manasquan, NJ. Shore-home specialists. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Manasquan, NJ",
    introduction:
      "AXO Floors serves Manasquan homeowners and shore-rental investors with hardwood installations, refinishes and staircase rebuilds — built to handle beach traffic and seasonal humidity.",
    localFlooringInformation:
      "Manasquan's older Squan Village homes typically have original red oak with character. We refinish these floors with the right combination of stain and finish to keep their charm while standing up to high-traffic summer rental seasons.",
    projectGallery: standardGallery("Manasquan"),
    faq: monmouthFaq("Manasquan"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Point Pleasant",
    slug: "point-pleasant",
    county: "Ocean",
    countySlug: "ocean",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08742"],
    neighborhoods: ["Point Pleasant Beach", "Point Pleasant Borough", "Bay Head border"],
    nearbyCities: ["manasquan", "belmar", "toms-river"],
    metaTitle: "Hardwood Flooring in Point Pleasant, NJ | AXO Floors",
    metaDescription: "Hardwood install, sanding & refinishing in Point Pleasant, NJ. Shore homes and rentals. Free estimates — (732) 351-8653.",
    h1: "Hardwood Flooring Services in Point Pleasant, NJ",
    introduction:
      "AXO Floors serves Point Pleasant Beach and Point Pleasant Borough with hardwood installations, refinishes and staircase work — clean, contained, and built for shore conditions.",
    localFlooringInformation:
      "Point Pleasant's bayfront and oceanfront homes face high humidity year-round. We typically recommend engineered hardwood over solid for any space below grade or on slab, and water-based finishes for their faster cure times and lower humidity sensitivity during application.",
    projectGallery: standardGallery("Point Pleasant"),
    faq: monmouthFaq("Point Pleasant"),
    published: true,
    indexable: true,
  },
  {
    cityName: "Toms River",
    slug: "toms-river",
    county: "Ocean",
    countySlug: "ocean",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08753", "08755", "08757"],
    neighborhoods: ["Downtown Toms River", "Silverton", "Pleasant Plains", "Holiday City"],
    nearbyCities: ["point-pleasant"],
    metaTitle: "Hardwood Flooring in Toms River, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and stair work in Toms River, NJ. Silverton, Pleasant Plains, Holiday City. Call (732) 351-8653.",
    h1: "Hardwood Flooring Services in Toms River, NJ",
    introduction:
      "AXO Floors serves Toms River Township with hardwood installations, refinishing and staircase work — Silverton, Pleasant Plains, Holiday City and downtown.",
    localFlooringInformation:
      "Toms River's diverse housing — from historic downtown homes to active-adult communities in Holiday City — means we work with every type of hardwood and engineered product. We assess each home individually and quote honestly.",
    projectGallery: standardGallery("Toms River"),
    faq: monmouthFaq("Toms River"),
    published: true,
    indexable: true,
  },
];

// ─── Lookups ────────────────────────────────────────────────────────────
export const getPublishedLocations = () =>
  njLocations.filter((l) => l.published);

export const getIndexableLocations = () =>
  njLocations.filter((l) => l.published && l.indexable);

export const getLocationBySlug = (slug: string) =>
  njLocations.find((l) => l.slug === slug && l.published);

export const getLocationsByCounty = (countySlug: string) =>
  njLocations.filter((l) => l.countySlug === countySlug && l.published);

export const getCounties = () => {
  const seen = new Map<string, { name: string; slug: string; count: number }>();
  for (const loc of getPublishedLocations()) {
    const existing = seen.get(loc.countySlug);
    if (existing) existing.count += 1;
    else seen.set(loc.countySlug, { name: loc.county, slug: loc.countySlug, count: 1 });
  }
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
};
