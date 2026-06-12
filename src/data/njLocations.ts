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
  // ─── Optional premium-template fields (Phase 6) ────────────────────
  // City-specific copy used by the upgraded CityServiceAreaPage. Safe
  // to leave undefined on cities that still ship the seed copy.
  heroDescription?: string;
  localOverviewTitle?: string;     // e.g. "Hardwood Flooring Considerations in Long Branch Homes"
  localOverview?: string;          // factual city overview copy
  coastalNote?: string;            // optional climate / coastal qualifier
  localFaqs?: { q: string; a: string }[];
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
    h1: "Hardwood Floor Refinishing & Installation in Long Branch, NJ",
    introduction:
      "Restore worn hardwood, repair damaged boards, or install a new floor with a hands-on flooring team focused on careful preparation, precise craftsmanship, and finish recommendations for your home.",
    heroDescription:
      "Restore worn hardwood, repair damaged boards, or install a new floor with a hands-on flooring team focused on careful preparation, precise craftsmanship, and finish recommendations for your home.",
    localOverviewTitle: "Hardwood Flooring Considerations in Long Branch Homes",
    localOverview:
      "Long Branch includes older shore properties, renovated single-family homes, and condominiums with different flooring conditions and project requirements. During an estimate, AXO Floors evaluates the existing finish, wood thickness, damaged boards, transitions, previous repairs, subfloor conditions, and indoor moisture before recommending refinishing, repair, or replacement.",
    coastalNote:
      "Seasonal indoor humidity and proximity to the coast may affect wood movement, gaps, and finish performance, but the appropriate solution depends on the conditions inside the individual property.",
    localFlooringInformation:
      "Long Branch includes older shore properties, renovated single-family homes, and condominiums with different flooring conditions and project requirements. During an estimate, AXO Floors evaluates the existing finish, wood thickness, damaged boards, transitions, previous repairs, subfloor conditions, and indoor moisture before recommending refinishing, repair, or replacement.",
    published: true,
    indexable: true,
  },
  {
    cityName: "West Long Branch",
    slug: "west-long-branch",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07764"],
    neighborhoods: ["Monmouth University area", "Cedar Avenue corridor", "Franklin Lake area"],
    nearbyCitySlugs: ["long-branch", "oakhurst", "eatontown", "oceanport"],
    metaTitle: "Hardwood Flooring in West Long Branch, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, and repair services for West Long Branch, NJ homes. Free in-home estimates.",
    h1: "Hardwood Floor Refinishing & Installation in West Long Branch, NJ",
    heroDescription:
      "Refinish original hardwood, address repairs in renovated rooms, or install new flooring with a hands-on AXO Floors crew that reviews each home before recommending the right approach.",
    introduction:
      "AXO Floors serves single-family homeowners in West Long Branch with hardwood installation, sanding and refinishing, repairs, and stair work — including projects that involve transitions between original floors and recently renovated spaces.",
    localOverviewTitle: "Hardwood Flooring Considerations in West Long Branch Homes",
    localOverview:
      "West Long Branch is largely a single-family residential community, and many homes have a mix of older hardwood and newer flooring added during renovations. During an estimate, AXO Floors evaluates the existing finish, board condition, transitions between original and updated rooms, and any prior repairs before recommending refinishing, board replacement, or new installation.",
    localFlooringInformation:
      "West Long Branch is largely a single-family residential community, and many homes have a mix of older hardwood and newer flooring added during renovations. During an estimate, AXO Floors evaluates the existing finish, board condition, transitions between original and updated rooms, and any prior repairs before recommending refinishing, board replacement, or new installation.",
    localFaqs: [
      { q: "Do you provide hardwood estimates in West Long Branch, NJ?", a: "Yes. AXO Floors provides free, in-home estimates throughout West Long Branch. You can request one online or call (732) 351-8653." },
      { q: "Can older hardwood in West Long Branch homes be refinished?", a: "Often yes. Refinishing depends on remaining board thickness and the condition of the existing finish — both are reviewed in person before any work is recommended." },
      { q: "Can you match new flooring to an existing room?", a: "We evaluate species, board width, stain, and sheen of the existing floor and recommend the closest reasonable match. An exact match is not always possible when old materials are out of production." },
      { q: "Can damaged boards be replaced without redoing the whole floor?", a: "Sometimes. Weave-in repairs are possible when matching material is available; the new boards are blended during sanding and finishing. We confirm the approach on-site." },
      { q: "What does the refinishing process look like?", a: "Furniture is moved or staged, the floor is prepared and sanded with dust-contained equipment, stain and finish are applied in coats, and the floor cures before normal use returns." },
      { q: "Can you refinish stairs at the same time?", a: "Yes. Many West Long Branch projects include stair refinishing or carpeted-stair conversion, matched to the first-floor finish where possible." },
      { q: "How long does a typical project take?", a: "It depends on square footage, repairs, stain selection, and the finish system's drying and curing times. We share a realistic timeline after the on-site assessment." },
      { q: "Is sanding completely dust-free?", a: "No process is fully dust-free, but we use dust-contained sanding equipment that captures the large majority of dust at the source." },
      { q: "Can I stay in the home during the project?", a: "Many homeowners stay in part of the home. Living arrangements are discussed during the estimate based on layout and finish system." },
    ],
    published: true,
    indexable: true,
  },
  {
    cityName: "Oakhurst",
    slug: "oakhurst",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07755"],
    neighborhoods: ["Wanamassa border", "Deal Park area", "West Park Avenue corridor"],
    nearbyCitySlugs: ["long-branch", "west-long-branch", "eatontown"],
    metaTitle: "Hardwood Flooring in Oakhurst, NJ | AXO Floors",
    metaDescription: "Hardwood refinishing, repairs, and new installation for Oakhurst homes in Ocean Township, NJ. Free in-home estimates.",
    h1: "Hardwood Floor Refinishing & Installation in Oakhurst, NJ",
    heroDescription:
      "Refinish original hardwood, blend new flooring into remodeled rooms, or repair damaged sections with a hands-on flooring team focused on careful evaluation and craftsmanship.",
    introduction:
      "AXO Floors serves homes within the Ocean Township area of Oakhurst with hardwood refinishing, board repair, and new installation — including projects where additions or remodeled rooms need to match the rest of the home.",
    localOverviewTitle: "Hardwood Flooring Considerations in Oakhurst Homes",
    localOverview:
      "Oakhurst is a service area within Ocean Township, with many homes that include original hardwood alongside additions and remodeled spaces. Matching new floors to existing rooms, evaluating weave-in repairs, and assessing whether a full sand or a recoat is appropriate are common parts of an Oakhurst estimate.",
    localFlooringInformation:
      "Oakhurst is a service area within Ocean Township, with many homes that include original hardwood alongside additions and remodeled spaces. Matching new floors to existing rooms, evaluating weave-in repairs, and assessing whether a full sand or a recoat is appropriate are common parts of an Oakhurst estimate.",
    localFaqs: [
      { q: "Do you provide hardwood estimates in Oakhurst, NJ?", a: "Yes. AXO Floors provides free, in-home estimates throughout the Oakhurst area of Ocean Township. Call (732) 351-8653 or request one online." },
      { q: "Can you match new hardwood to an existing room?", a: "We compare species, plank width, stain, and sheen, then recommend the closest reasonable match. An exact match is not guaranteed when the original product is no longer made." },
      { q: "How do you decide between a full sand and a recoat?", a: "Recoats are usually considered when the existing finish is intact and there is no raw wood or deep damage. The decision is confirmed on-site after evaluating the floor." },
      { q: "Can weave-in repairs be blended with the existing floor?", a: "When matching material is available, replacement boards are woven into the existing pattern and blended during sanding and finishing. We discuss expectations before starting." },
      { q: "Do you work in additions where flooring transitions meet original rooms?", a: "Yes. Transition planning is part of the estimate — including how to handle different board heights, species, or finishes between rooms." },
      { q: "Is engineered hardwood refinishable?", a: "Often yes, but it depends on the wear-layer thickness. Thicker wear layers can typically be sanded once or twice; thinner layers may be better suited to a recoat." },
      { q: "How long does a typical Oakhurst project take?", a: "Duration depends on square footage, repairs, stain choice, and the finish system's curing time. We share a realistic timeline after the on-site visit." },
      { q: "Do you handle stairs in the same project?", a: "Yes. Stair refinishing and carpeted-stair conversion can be coordinated with the rest of the floor." },
    ],
    published: true,
    indexable: true,
  },
  {
    cityName: "Oceanport",
    slug: "oceanport",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07757"],
    neighborhoods: ["Port-au-Peck", "Oceanport Avenue corridor", "Main Street area"],
    nearbyCitySlugs: ["long-branch", "west-long-branch", "eatontown"],
    metaTitle: "Hardwood Flooring in Oceanport, NJ | AXO Floors",
    metaDescription: "Hardwood refinishing, repair, and installation for Oceanport, NJ homes. Free in-home estimates.",
    h1: "Hardwood Floor Refinishing & Installation in Oceanport, NJ",
    heroDescription:
      "Restore worn hardwood, repair damaged boards, or install a new floor with a hands-on AXO Floors crew that reviews each property before recommending the right next step.",
    introduction:
      "AXO Floors serves single-family residential properties in Oceanport with hardwood refinishing, renovation-related repairs, and new installation — including floor transitions and replacement of damaged boards after remodeling work.",
    localOverviewTitle: "Hardwood Flooring Considerations in Oceanport Homes",
    localOverview:
      "Oceanport is primarily a single-family residential community. Homes vary in age and condition, and many projects we estimate here involve renovation-related work — replacing damaged boards, blending transitions between updated rooms, or refinishing floors that have lost their original finish over time.",
    coastalNote:
      "Seasonal indoor humidity can be a consideration in some Oceanport properties, but the appropriate solution depends on the conditions inside each individual home — not every property has the same exposure.",
    localFlooringInformation:
      "Oceanport is primarily a single-family residential community. Homes vary in age and condition, and many projects we estimate here involve renovation-related work — replacing damaged boards, blending transitions between updated rooms, or refinishing floors that have lost their original finish over time.",
    localFaqs: [
      { q: "Do you provide hardwood estimates in Oceanport, NJ?", a: "Yes. AXO Floors provides free, in-home estimates throughout Oceanport. Call (732) 351-8653 or request one online." },
      { q: "Can damaged boards from a renovation be replaced?", a: "Often yes. Weave-in board replacement and blended refinishing are common in renovation-related projects. The approach is confirmed on-site." },
      { q: "How are floor transitions between rooms handled?", a: "Transitions are reviewed during the estimate — including differences in board height, species, and finish between rooms — and we recommend an approach that fits the home." },
      { q: "Does indoor humidity affect floor performance?", a: "It can. Seasonal indoor humidity may influence wood movement and gaps in some homes, but the appropriate response depends on each property's HVAC, subfloor, and existing conditions." },
      { q: "Can older hardwood be refinished rather than replaced?", a: "Often yes, depending on remaining board thickness and finish condition. Replacement is recommended only when refinishing is not appropriate." },
      { q: "What finish systems do you use?", a: "We use both water-based and oil-based systems. The right choice depends on wood species, desired appearance, and household use — discussed during the estimate." },
      { q: "How long does a typical project take?", a: "Duration depends on square footage, repairs, stain selection, and finish curing. We share a realistic timeline after the on-site assessment." },
      { q: "Can I stay in the home during the work?", a: "Often yes, depending on the layout and the finish system. Living arrangements are discussed during the estimate." },
    ],
    published: true,
    indexable: false,
  },
  {
    cityName: "Eatontown",
    slug: "eatontown",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724"],
    neighborhoods: ["Wyckoff Road corridor", "Wampum Lake area", "Industrial Way area"],
    nearbyCitySlugs: ["tinton-falls", "long-branch", "west-long-branch", "oakhurst"],
    metaTitle: "Hardwood Flooring in Eatontown, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, and stair work for Eatontown, NJ homes. Free in-home estimates.",
    h1: "Hardwood Floor Refinishing & Installation in Eatontown, NJ",
    heroDescription:
      "Install new hardwood, refinish existing floors, or coordinate stair and trim work with a hands-on AXO Floors crew that reviews each property before recommending the right approach.",
    introduction:
      "AXO Floors serves Eatontown's varied housing — including older homes with original hardwood, remodeled interiors, and projects that involve flooring replacement, stair coordination, and subfloor or transition work.",
    localOverviewTitle: "Hardwood Flooring Considerations in Eatontown Homes",
    localOverview:
      "Eatontown contains a mix of housing types built across different decades, so floor conditions vary widely. Many estimates involve evaluating older hardwood for refinishing, planning installation in remodeled spaces, and reviewing subfloor and transition conditions where new and existing flooring meet — including coordination with stairs when applicable.",
    localFlooringInformation:
      "Eatontown contains a mix of housing types built across different decades, so floor conditions vary widely. Many estimates involve evaluating older hardwood for refinishing, planning installation in remodeled spaces, and reviewing subfloor and transition conditions where new and existing flooring meet — including coordination with stairs when applicable.",
    localFaqs: [
      { q: "Do you provide hardwood estimates in Eatontown, NJ?", a: "Yes. AXO Floors provides free, in-home estimates throughout Eatontown. Call (732) 351-8653 or request one online." },
      { q: "Do you work in homes that mix old and new flooring?", a: "Yes. We evaluate transitions, board heights, and finish differences between rooms and recommend an approach that fits the home." },
      { q: "Do you handle subfloor preparation before installation?", a: "Subfloor evaluation and preparation are part of the installation process. The scope is confirmed after reviewing the existing subfloor on-site." },
      { q: "Can hardwood and stairs be coordinated in one project?", a: "Yes. Stair refinishing or carpeted-stair conversion can be scheduled with the rest of the floor work and matched to the first-floor finish where possible." },
      { q: "Can older hardwood in Eatontown homes still be refinished?", a: "Often yes. Refinishing depends on remaining board thickness and the condition of the existing finish, which are reviewed in person." },
      { q: "What is the difference between water-based and oil-based finishes?", a: "Water-based finishes tend to be lower-odor and faster to cure; oil-based finishes have a warmer amber tone and a different cure profile. The right choice depends on the project." },
      { q: "How long does a typical project take?", a: "Duration depends on square footage, repairs, stain selection, and finish curing. We share a realistic timeline after the on-site assessment." },
      { q: "Is sanding completely dust-free?", a: "No process is fully dust-free, but dust-contained sanding captures the large majority of dust at the source." },
    ],
    published: true,
    indexable: false,
  },
  {
    cityName: "Tinton Falls",
    slug: "tinton-falls",
    county: "Monmouth",
    state: "New Jersey",
    stateCode: "NJ",
    zipCodes: ["07724", "07753", "07712"],
    neighborhoods: ["Hance Park area", "Wayside", "Shrewsbury Avenue corridor"],
    nearbyCitySlugs: ["eatontown", "long-branch", "west-long-branch", "oakhurst"],
    metaTitle: "Hardwood Flooring in Tinton Falls, NJ | AXO Floors",
    metaDescription: "Hardwood installation, refinishing, and repair for Tinton Falls, NJ single-family homes and townhomes. Free in-home estimates.",
    h1: "Hardwood Floor Refinishing & Installation in Tinton Falls, NJ",
    heroDescription:
      "Install new hardwood, refinish existing floors, or plan continuity between rooms and stairs with a hands-on AXO Floors crew that reviews each property before recommending the right approach.",
    introduction:
      "AXO Floors works in Tinton Falls single-family homes, townhomes, and renovated interiors — handling installation, refinishing, and projects that involve continuity between rooms, hallways, and stairs.",
    localOverviewTitle: "Hardwood Flooring Considerations in Tinton Falls Homes",
    localOverview:
      "Tinton Falls includes a mix of single-family homes and townhome communities. Not every property contains hardwood, so estimates often start with evaluating what is currently in place — engineered or solid hardwood, age and wear-layer of the existing floor — and discussing continuity between rooms, hallways, and stairs.",
    localFlooringInformation:
      "Tinton Falls includes a mix of single-family homes and townhome communities. Not every property contains hardwood, so estimates often start with evaluating what is currently in place — engineered or solid hardwood, age and wear-layer of the existing floor — and discussing continuity between rooms, hallways, and stairs.",
    localFaqs: [
      { q: "Do you provide hardwood estimates in Tinton Falls, NJ?", a: "Yes. AXO Floors provides free, in-home estimates throughout Tinton Falls. Call (732) 351-8653 or request one online." },
      { q: "Can engineered hardwood be refinished?", a: "Often yes, depending on wear-layer thickness. Thicker wear layers can typically be sanded once or twice; thinner layers may be better suited to a recoat." },
      { q: "How do you plan continuity between rooms and hallways?", a: "We evaluate board direction, species, stain, and transitions during the estimate and recommend an approach that keeps adjacent spaces visually consistent." },
      { q: "Can stair finishes be matched to the first floor?", a: "In most projects the stair finish can be matched, subject to species and condition of the stair treads. We confirm what is realistic on-site." },
      { q: "How do you decide between solid and engineered hardwood?", a: "The right product depends on subfloor type, room conditions, and budget. We review both options where appropriate and explain trade-offs." },
      { q: "Can older floors be refinished or do they need replacement?", a: "Refinishing depends on remaining board thickness and finish condition. Replacement is recommended only when refinishing is no longer appropriate." },
      { q: "How long does a typical project take?", a: "Duration depends on square footage, repairs, stain selection, and finish curing. We share a realistic timeline after the on-site assessment." },
      { q: "Is sanding completely dust-free?", a: "No process is fully dust-free, but dust-contained sanding captures the large majority of dust at the source." },
    ],
    published: true,
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
    nearbyCitySlugs: ["colts-neck"],
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
