// Programmatic local-SEO dataset for AXO Floors NJ — Phase 1 (data only).
// Routes, pages and sitemap entries are intentionally NOT wired up yet.
// All entries are seeded with `published: false` and `indexable: false`
// so nothing is exposed publicly until the city-page template ships.
//
// To scale to all 564 NJ municipalities, append entries with the same
// shape (or import from CSV/JSON into this array) — no new page
// components required.

export interface NJLocation {
  cityName: string;
  slug: string;                 // url-safe, e.g. "red-bank"
  county: string;               // e.g. "Monmouth"
  state: string;                // "New Jersey"
  stateCode: string;            // "NJ"
  zipCodes: string[];
  neighborhoods: string[];
  nearbyCitySlugs: string[];    // slugs of nearby seeded cities
  metaTitle: string;            // ≤60 chars target
  metaDescription: string;      // ≤160 chars target
  h1: string;
  introduction: string;         // 1–2 paragraphs, city-specific
  localFlooringInformation: string; // longer body; housing stock, climate notes
  published: boolean;
  indexable: boolean;
}

export const njLocations: NJLocation[] = [
  {
    cityName: "Long Branch",
    slug: "long-branch",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07740"],
    neighborhoods: ["Elberon", "West End", "North Long Branch", "Pleasure Bay", "Branchport"],
    nearbyCitySlugs: ["west-long-branch", "oceanport", "eatontown", "oakhurst", "asbury-park"],
    metaTitle: "Hardwood Flooring in Long Branch, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding and refinishing in Long Branch, NJ. Dust-contained service, licensed and insured. Free estimates.",
    h1: "Hardwood Flooring Services in Long Branch, NJ",
    introduction:
      "AXO Floors serves homeowners across Long Branch — from Elberon down to Pleasure Bay — with hardwood installation, sanding, refinishing and staircase work.",
    localFlooringInformation:
      "Long Branch's housing stock ranges from early-1900s shore homes with original red oak strip flooring to modern high-rise condos along Ocean Avenue. Salt air and humidity swings mean shore-area floors typically benefit from hard-wax oils or commercial-grade water-based finishes that handle moisture better than older oil-based polys.",
    published: false,
    indexable: false,
  },
  {
    cityName: "West Long Branch",
    slug: "west-long-branch",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07764"],
    neighborhoods: ["Monmouth University area", "Franklin Lake", "Cedar Avenue"],
    nearbyCitySlugs: ["long-branch", "oakhurst", "eatontown", "oceanport"],
    metaTitle: "Hardwood Flooring in West Long Branch, NJ | AXO Floors",
    metaDescription: "Professional hardwood installation, refinishing and stair work in West Long Branch, NJ. Free in-home estimates.",
    h1: "Hardwood Flooring Services in West Long Branch, NJ",
    introduction:
      "Serving West Long Branch and the Monmouth University neighborhood with hardwood installation, sanding, refinishing, and staircase and trim work.",
    localFlooringInformation:
      "Many West Long Branch homes are mid-century colonials and split-levels with original red oak that responds well to a modern refinish. Natural and lightly stained finishes that complement open-floor-plan renovations are common requests in the borough.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Oakhurst",
    slug: "oakhurst",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07755"],
    neighborhoods: ["Wanamassa border", "Deal Park"],
    nearbyCitySlugs: ["long-branch", "west-long-branch", "asbury-park", "eatontown"],
    metaTitle: "Hardwood Flooring in Oakhurst, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding and refinishing in Oakhurst (Ocean Township), NJ. Dust-contained, licensed and insured.",
    h1: "Hardwood Flooring Services in Oakhurst, NJ",
    introduction:
      "AXO Floors serves Oakhurst and the surrounding Ocean Township area with full-service hardwood flooring — installations, sand-and-refinish, and repairs.",
    localFlooringInformation:
      "Oakhurst homes commonly feature 2¼\" red oak strip flooring from the 1950s–70s. These floors usually have several sandings of life left and refinish well with modern water-based finishes that are low-odor and dry fast.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Oceanport",
    slug: "oceanport",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07757"],
    neighborhoods: ["Port-au-Peck", "Pleasure Bay", "Little Silver Point"],
    nearbyCitySlugs: ["long-branch", "little-silver", "fair-haven", "rumson"],
    metaTitle: "Hardwood Flooring in Oceanport, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding and refinishing in Oceanport, NJ. Free on-site estimates.",
    h1: "Hardwood Flooring Services in Oceanport, NJ",
    introduction:
      "AXO Floors works throughout Oceanport — from Port-au-Peck to Pleasure Bay — installing and refinishing hardwood floors with a clean, contained process.",
    localFlooringInformation:
      "Oceanport's waterfront homes deal with consistent humidity. Pre-finished engineered hardwood is a good fit for slab-on-grade additions, while solid white oak with moisture-tolerant finishes performs well in main living areas.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Eatontown",
    slug: "eatontown",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724"],
    neighborhoods: ["Wampum Lake", "Wyckoff Road corridor"],
    nearbyCitySlugs: ["tinton-falls", "long-branch", "west-long-branch", "oakhurst"],
    metaTitle: "Hardwood Flooring in Eatontown, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, stairs and repairs in Eatontown, NJ. Licensed and insured. Free estimates.",
    h1: "Hardwood Flooring Services in Eatontown, NJ",
    introduction:
      "AXO Floors provides hardwood installation, refinishing and staircase work throughout Eatontown — from older colonials near Wampum Lake to newer townhomes along Wyckoff Road.",
    localFlooringInformation:
      "Eatontown has a mix of ranches and colonials from the 1960s–80s plus newer construction with engineered hardwood. Both site-finished solid hardwood and pre-finished installations are common, often with full subfloor leveling.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Tinton Falls",
    slug: "tinton-falls",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724", "07753", "07712"],
    neighborhoods: ["Hance Park", "Shark River Hills border", "Wayside"],
    nearbyCitySlugs: ["eatontown", "asbury-park", "shrewsbury", "red-bank"],
    metaTitle: "Hardwood Flooring in Tinton Falls, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand and refinish, stairs and repairs in Tinton Falls, NJ. Free in-home estimates.",
    h1: "Hardwood Flooring Services in Tinton Falls, NJ",
    introduction:
      "AXO Floors serves Tinton Falls homeowners with hardwood installation, sanding, refinishing and staircase work — from active-adult communities to single-family colonials.",
    localFlooringInformation:
      "Newer Tinton Falls developments often have engineered hardwood that can be refinished once or twice depending on wear-layer thickness. Buff-and-recoat is an affordable alternative to a full sand when the wear layer is thin.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Red Bank",
    slug: "red-bank",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07701"],
    neighborhoods: ["West Side", "East Side", "Riverside Gardens", "Broad Street"],
    nearbyCitySlugs: ["fair-haven", "little-silver", "shrewsbury", "rumson", "middletown"],
    metaTitle: "Hardwood Flooring in Red Bank, NJ | AXO Floors",
    metaDescription: "Premium hardwood installation and refinishing in Red Bank, NJ. Victorian restorations and modern finishes.",
    h1: "Hardwood Flooring Services in Red Bank, NJ",
    introduction:
      "Red Bank's historic homes deserve careful craftsmanship. AXO Floors restores original hardwood in Victorian and early-1900s homes throughout the West Side, and installs modern floors in renovated downtown lofts and condos.",
    localFlooringInformation:
      "Many Red Bank homes have original 2¼\" red or white oak — sometimes with intricate borders or parquet medallions in the entry. Period-correct restorations often call for custom stain matching and weave-in board repairs around original detail.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Rumson",
    slug: "rumson",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07760"],
    neighborhoods: ["Rumson Road corridor", "Bingham Avenue", "Sea Bright border"],
    nearbyCitySlugs: ["fair-haven", "little-silver", "red-bank", "oceanport"],
    metaTitle: "Hardwood Flooring in Rumson, NJ | AXO Floors",
    metaDescription: "High-end hardwood installation and refinishing in Rumson, NJ. Custom stains, wide-plank white oak, staircases.",
    h1: "Hardwood Flooring Services in Rumson, NJ",
    introduction:
      "AXO Floors works with Rumson homeowners and builders on high-end hardwood installations and meticulous refinishes — including wide-plank white oak, custom stains and full staircase rebuilds.",
    localFlooringInformation:
      "Rumson estates often feature rift-and-quartered white oak in widths from 6\" to 10\", with custom stain blends. Premium finish systems like Bona, Rubio Monocoat and Pallmann are typical, and warm, fumed and natural-matte looks are currently in demand.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Fair Haven",
    slug: "fair-haven",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07704"],
    neighborhoods: ["River Road", "Fair Haven Fields"],
    nearbyCitySlugs: ["red-bank", "rumson", "little-silver", "middletown"],
    metaTitle: "Hardwood Flooring in Fair Haven, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand and refinish in Fair Haven, NJ. Family-owned, licensed and insured. Free estimates.",
    h1: "Hardwood Flooring Services in Fair Haven, NJ",
    introduction:
      "AXO Floors serves Fair Haven families with hardwood installations, refinishing and staircase work — handling everything from older River Road homes to recent renovations near Fair Haven Fields.",
    localFlooringInformation:
      "Fair Haven's mature housing stock means many homes have original oak that has been refinished a few times already. Measuring remaining board thickness before sanding is important; a recoat is often a safer option than a full sand on thin boards.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Little Silver",
    slug: "little-silver",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07739"],
    neighborhoods: ["Markham Place", "Parker Avenue", "Borough Center"],
    nearbyCitySlugs: ["red-bank", "shrewsbury", "fair-haven", "oceanport"],
    metaTitle: "Hardwood Flooring in Little Silver, NJ | AXO Floors",
    metaDescription: "Hardwood install, refinishing and stair work in Little Silver, NJ. Free in-home estimates.",
    h1: "Hardwood Flooring Services in Little Silver, NJ",
    introduction:
      "Little Silver homeowners turn to AXO Floors for hardwood installations, sand-and-refinish, and staircase work — done cleanly with respect for the home and schedule.",
    localFlooringInformation:
      "Little Silver's classic colonials and capes typically have 2¼\" or 3¼\" oak strip flooring. Modern low-VOC water-based finishes cure faster and harder than older oil-based finishes and work well in these homes.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Shrewsbury",
    slug: "shrewsbury",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07702"],
    neighborhoods: ["Broad Street", "Sycamore Avenue", "Shrewsbury Township border"],
    nearbyCitySlugs: ["red-bank", "tinton-falls", "little-silver", "eatontown"],
    metaTitle: "Hardwood Flooring in Shrewsbury, NJ | AXO Floors",
    metaDescription: "Hardwood install, sand and refinish and stairs in Shrewsbury, NJ. Licensed and insured. Free estimates.",
    h1: "Hardwood Flooring Services in Shrewsbury, NJ",
    introduction:
      "AXO Floors serves Shrewsbury Borough with hardwood installations, refinishing, repairs and staircase work — clean process, clear pricing.",
    localFlooringInformation:
      "Shrewsbury blends historic colonials with newer construction along Sycamore Avenue, requiring both restoration of original heart-pine and oak and installation of newer wide-plank engineered systems.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Middletown",
    slug: "middletown",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07748", "07701", "07757", "07758"],
    neighborhoods: ["Lincroft", "Belford", "Port Monmouth", "Leonardo", "Navesink", "River Plaza"],
    nearbyCitySlugs: ["red-bank", "holmdel", "fair-haven", "rumson"],
    metaTitle: "Hardwood Flooring in Middletown, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, stairs and repairs across Middletown Township, NJ. Free in-home estimates.",
    h1: "Hardwood Flooring Services in Middletown, NJ",
    introduction:
      "AXO Floors covers all of Middletown Township — Lincroft, Navesink, Belford, Leonardo and the River Plaza area — with hardwood installation, sanding, refinishing and staircase work.",
    localFlooringInformation:
      "Middletown spans a wide variety of housing: shore-area capes in Belford and Port Monmouth, mid-century ranches in Lincroft, and larger colonials in Navesink. Each subfloor type calls for a slightly different install system, from glue-down engineered to nail-down 3/4\" solid.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Holmdel",
    slug: "holmdel",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07733"],
    neighborhoods: ["Holmdel Village", "Crawfords Corner", "Roberts Road"],
    nearbyCitySlugs: ["middletown", "colts-neck", "red-bank"],
    metaTitle: "Hardwood Flooring in Holmdel, NJ | AXO Floors",
    metaDescription: "Premium hardwood installation and refinishing in Holmdel, NJ. Wide-plank white oak, custom stains, staircases.",
    h1: "Hardwood Flooring Services in Holmdel, NJ",
    introduction:
      "AXO Floors serves Holmdel with premium hardwood installation, sanding and refinishing — from estate-style colonials to renovated mid-century homes near Holmdel Village.",
    localFlooringInformation:
      "Holmdel's larger homes commonly use wide-plank white oak with rift-and-quartered grain, finished with hard-wax oil or commercial-grade water-based topcoats. Custom stain matching across great rooms, hallways and stairs is a frequent ask.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Colts Neck",
    slug: "colts-neck",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07722"],
    neighborhoods: ["Bucks Mill Road area", "Heyers Mill", "Phalanx Road corridor"],
    nearbyCitySlugs: ["holmdel", "freehold", "middletown"],
    metaTitle: "Hardwood Flooring in Colts Neck, NJ | AXO Floors",
    metaDescription: "Custom hardwood installation, refinishing and staircase work in Colts Neck, NJ. Estate homes, wide-plank white oak.",
    h1: "Hardwood Flooring Services in Colts Neck, NJ",
    introduction:
      "AXO Floors works on Colts Neck estates and equestrian properties — custom hardwood installations, full-home refinishing, and staircase rebuilds.",
    localFlooringInformation:
      "Colts Neck homes typically run large, with great rooms and second floors that benefit from continuous wide-plank installations. Engineered hardwood over radiant heat is a common requirement, and we plan board acclimation and expansion carefully on these jobs.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Freehold",
    slug: "freehold",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07728"],
    neighborhoods: ["Freehold Borough", "Freehold Township", "Downtown Main Street"],
    nearbyCitySlugs: ["colts-neck", "manalapan", "howell"],
    metaTitle: "Hardwood Flooring in Freehold, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding, refinishing and stairs in Freehold, NJ. Licensed and insured. Free estimates.",
    h1: "Hardwood Flooring Services in Freehold, NJ",
    introduction:
      "AXO Floors serves Freehold Borough and Freehold Township with hardwood installation, sanding, refinishing, and staircase work — from historic downtown homes to newer subdivisions.",
    localFlooringInformation:
      "Freehold's older downtown homes often have original heart-pine or oak that benefits from gentle sanding and historically appropriate finishes. Newer Freehold Township homes typically have pre-finished or site-finished oak that responds well to modern water-based topcoats.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Asbury Park",
    slug: "asbury-park",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07712"],
    neighborhoods: ["North Beach", "West Side", "Downtown", "Wesley Lake"],
    nearbyCitySlugs: ["belmar", "oakhurst", "tinton-falls", "long-branch"],
    metaTitle: "Hardwood Flooring in Asbury Park, NJ | AXO Floors",
    metaDescription: "Hardwood install, sanding and refinishing in Asbury Park, NJ. Restoration of historic shore homes and modern condos.",
    h1: "Hardwood Flooring Services in Asbury Park, NJ",
    introduction:
      "AXO Floors restores hardwood in Asbury Park's historic shore homes and installs new floors in renovated downtown lofts and condos near the boardwalk.",
    localFlooringInformation:
      "Asbury Park's housing mix — Victorians on the West Side, mid-century bungalows, and converted downtown buildings — calls for both careful restoration of original oak and pine and modern engineered installs over leveled subfloors. Shore humidity is a constant consideration in finish selection.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Belmar",
    slug: "belmar",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07719"],
    neighborhoods: ["North Belmar", "5th Avenue", "Marina district"],
    nearbyCitySlugs: ["asbury-park", "manasquan", "tinton-falls"],
    metaTitle: "Hardwood Flooring in Belmar, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding and refinishing in Belmar, NJ. Shore-tested finishes, dust-contained sanding.",
    h1: "Hardwood Flooring Services in Belmar, NJ",
    introduction:
      "AXO Floors serves Belmar — from year-round homes north of Main Street to summer rentals near the boardwalk — with hardwood installation, sand-and-refinish and stair work.",
    localFlooringInformation:
      "Belmar's shore environment puts hardwood through humidity swings and heavy seasonal foot traffic. Moisture-tolerant finishes and well-acclimated boards are important for floors that hold up year-round near the ocean.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Manasquan",
    slug: "manasquan",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08736"],
    neighborhoods: ["Manasquan Beach", "Brielle Road corridor", "Sea Watch"],
    nearbyCitySlugs: ["belmar", "point-pleasant", "asbury-park"],
    metaTitle: "Hardwood Flooring in Manasquan, NJ | AXO Floors",
    metaDescription: "Hardwood install, sanding and refinishing in Manasquan, NJ. Shore-area expertise, free in-home estimates.",
    h1: "Hardwood Flooring Services in Manasquan, NJ",
    introduction:
      "AXO Floors works throughout Manasquan — beachfront homes, rentals and year-round residences — with full-service hardwood installation, refinishing and repairs.",
    localFlooringInformation:
      "Manasquan's beach-block homes often face salt air and sand-tracked foot traffic. White oak with hard-wax oil or commercial water-based finishes is a strong choice; tighter board widths help reduce seasonal gapping in unheated shore homes.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Point Pleasant",
    slug: "point-pleasant",
    county: "Ocean",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08742"],
    neighborhoods: ["Point Pleasant Borough", "Point Pleasant Beach", "Bay Head border"],
    nearbyCitySlugs: ["manasquan", "toms-river"],
    metaTitle: "Hardwood Flooring in Point Pleasant, NJ | AXO Floors",
    metaDescription: "Hardwood installation, sanding and refinishing in Point Pleasant, NJ. Shore-rated finishes and dust-contained work.",
    h1: "Hardwood Flooring Services in Point Pleasant, NJ",
    introduction:
      "AXO Floors serves Point Pleasant Borough and Point Pleasant Beach with hardwood installation, sand-and-refinish, and staircase work — built for shore-area conditions.",
    localFlooringInformation:
      "Point Pleasant's mix of year-round homes and summer rentals means floors see large humidity swings between seasons. Pre-finished engineered hardwood and moisture-tolerant site finishes both have a role here, depending on subfloor type and HVAC setup.",
    published: false,
    indexable: false,
  },
  {
    cityName: "Toms River",
    slug: "toms-river",
    county: "Ocean",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["08753", "08755", "08757"],
    neighborhoods: ["Downtown", "Silverton", "Pleasant Plains", "Holiday City"],
    nearbyCitySlugs: ["point-pleasant"],
    metaTitle: "Hardwood Flooring in Toms River, NJ | AXO Floors",
    metaDescription: "Hardwood install, sanding and refinishing throughout Toms River, NJ. Licensed and insured. Free in-home estimates.",
    h1: "Hardwood Flooring Services in Toms River, NJ",
    introduction:
      "AXO Floors covers all of Toms River — from downtown and Silverton to Holiday City and Pleasant Plains — with hardwood installation, refinishing, stairs and repairs.",
    localFlooringInformation:
      "Toms River's housing ranges from waterfront homes that need humidity-tolerant systems to active-adult communities with engineered hardwood that benefits from recoats rather than full sandings. Wear-layer assessment guides whether to refinish or replace.",
    published: false,
    indexable: false,
  },
];

// ─── Lookup helpers (kept minimal; templates will consume the array) ───
export const getLocationBySlug = (slug: string): NJLocation | undefined =>
  njLocations.find((l) => l.slug === slug);

export const getPublishedLocations = (): NJLocation[] =>
  njLocations.filter((l) => l.published);
