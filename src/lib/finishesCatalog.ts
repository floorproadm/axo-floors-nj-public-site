// Product data for /finishes. Every claim comes from the manufacturer's US
// product page or technical data sheet; LOBA stress levels from LOBA Catalog 2026 (US).
import life from "@/assets/finishes/life.webp";
import viva from "@/assets/finishes/viva.webp";
import easyfinish from "@/assets/finishes/easyfinish.webp";
import duo from "@/assets/finishes/duo.webp";
import invisible from "@/assets/finishes/invisible.webp";
import supra from "@/assets/finishes/supra.png";
import mega from "@/assets/finishes/mega.png";
import megaone from "@/assets/finishes/megaone.png";
import go from "@/assets/finishes/go.png";
import hd from "@/assets/finishes/hd.png";
import easyprime from "@/assets/finishes/easyprime.webp";
import natural from "@/assets/finishes/natural.png";
import naturalSw from "@/assets/finishes/natural_sw.png";
import nordic from "@/assets/finishes/nordic.png";
import nordicSw from "@/assets/finishes/nordic_sw.png";
import amberseal from "@/assets/finishes/amberseal.png";
import amberSw from "@/assets/finishes/amberseal_swatch.png";
import intense from "@/assets/finishes/intense.png";
import intenseSw from "@/assets/finishes/intense_sw.png";
import amberizer from "@/assets/finishes/amberizer.webp";
import whitener from "@/assets/finishes/whitener.webp";
import uv from "@/assets/finishes/uv.webp";

export type Product = {
  img: string;
  brand: "LOBA" | "Bona";
  name: string;
  pill: string;
  desc: string;
  chips: { label: string; items: string[] }[];
  stress?: number;
  traffic?: { label: string; detail?: string };
  note?: string;
  swatch?: string;
};

export type Category = { num: string; id: string; title: string; brands: { brand: string; products: Product[] }[] };

const L = "LOBA" as const;
const B = "Bona" as const;

export const CATALOG: Category[] = [
  {
    num: "01", id: "finishes", title: "Water-Based Finishes",
    brands: [
      { brand: "LOBA", products: [
        { img: life, brand: L, name: "Life", pill: "1K · One-Component", desc: "A one-component water-based finish with balanced properties, excellent build and easy application — a strong price/performance choice for living areas.", stress: 5,
          chips: [{ label: "Available sheens (US)", items: ["Satin", "Semi-Gloss"] }, { label: "Recommended for", items: ["Living Areas", "Light-Colored Wood Species"] }] },
        { img: viva, brand: L, name: "Viva", pill: "1K · One-Component", desc: "A non-yellowing one-component finish with excellent chemical and abrasion resistance and powerful resistance to plasticizer migration from flooring adhesives.", stress: 5,
          chips: [{ label: "Available sheens (US)", items: ["Satin", "Semi-Gloss"] }, { label: "Recommended for", items: ["Normal to Heavy Residential", "Light Commercial"] }],
          note: "Fully cured after 5 days." },
        { img: easyfinish, brand: L, name: "EasyFinish", pill: "1K · Polyurethane-Acrylate", desc: "A non-yellowing polyurethane-acrylate finish with excellent wear resistance and high build — no mixing, no pot life, no waste.", stress: 7,
          chips: [{ label: "Available sheens (US)", items: ["Satin", "Semi-Gloss", "Gloss"] }, { label: "Recommended for", items: ["High-Traffic Residential", "Light Commercial"] }],
          note: "90% cured after 24 hours." },
        { img: duo, brand: L, name: "2K Duo", pill: "2K · Two-Component", desc: "A two-component water-based polyurethane finish formulated for extreme wear resistance, with excellent build and a non-yellowing appearance.", stress: 9,
          chips: [{ label: "Available sheens (US)", items: ["Extra Matte", "Satin", "Semi-Gloss"] }, { label: "Recommended for", items: ["High-Traffic Commercial Areas"] }] },
        { img: invisible, brand: L, name: "2K InvisibleProtect", pill: "2K · Natural Look", desc: "A non-ambering two-component finish that keeps the natural, untreated appearance of the wood while delivering excellent chemical and abrasion resistance.", stress: 9,
          chips: [{ label: "Appearance", items: ["Natural Untreated Look"] }, { label: "Recommended for", items: ["Residential", "High-Traffic Commercial"] }] },
        { img: supra, brand: L, name: "2K Supra A.T.", pill: "2K · Ceramic-Reinforced", desc: "Ceramic-reinforced polyurethane offering exceptional scratch resistance for demanding, high-traffic floors.", stress: 10,
          chips: [{ label: "Available sheens (US)", items: ["Satin", "Semi-Gloss", "Gloss"] }, { label: "Recommended for", items: ["High-Traffic Commercial Areas", "Demanding Residential Floors"] }],
          note: "Normal traffic after 12 hours. Fully cured after 3 days under recommended conditions." },
      ] },
      { brand: "Bona", products: [
        { img: mega, brand: B, name: "Bona Mega®", pill: "1K · Oxygen-Crosslinking", desc: "An oxygen-crosslinking polyurethane (OCP) finish with exceptional flow, leveling and build that enhances the natural color of the wood.",
          chips: [{ label: "Available sheens (US)", items: ["Extra Matte", "Satin", "Semi-Gloss", "Gloss"] }],
          traffic: { label: "Heavy-Traffic Residential & Commercial", detail: "Interior residential and commercial floors with heavy traffic." },
          note: "Dries in approximately 2–3 hours. 100% cure in 7 days." },
        { img: megaone, brand: B, name: "Bona Mega ONE®", pill: "1K · One-Component", desc: "A crystal-clear, fast-drying waterborne finish with excellent build and dependable long-term protection. Fully cured in 5 days.",
          chips: [{ label: "Available sheens (US)", items: ["Extra Matte", "Satin", "Semi-Gloss"] }, { label: "Recommended for", items: ["Heavy-Traffic Residential", "Commercial"] }],
          traffic: { label: "Heavy-Traffic Residential", detail: "Kitchens, entryways, family rooms, homes with pets and children; also commercial." } },
        { img: go, brand: B, name: "Bona Traffic GO®", pill: "1K · Built-In Hardener", desc: "Self-Crosslinking Waterborne Finish with Built-In Hardener — Bona's highest-performing one-component finish, with premium build and no mixing.",
          chips: [{ label: "Available sheens (US)", items: ["Extra Matte", "Satin", "Semi-Gloss"] }],
          traffic: { label: "High Durability", detail: "Bona's highest-performing one-component finish." },
          note: "3-day full cure. Very low VOC (<110 g/L). GREENGUARD Gold Certified." },
        { img: hd, brand: B, name: "Bona Traffic HD®", pill: "2K · With Hardener", desc: "Bona's leading waterborne finish, providing unsurpassed scuff, scratch and chemical resistance at full cure — with exceptional build, flow and leveling.",
          chips: [{ label: "Available sheens (US)", items: ["Extra Matte", "Satin", "Semi-Gloss", "Gloss"] }],
          traffic: { label: "Heavy Traffic & Commercial", detail: "For owners with an uncompromising attitude toward durability." },
          note: "Full cure in 3 days. No sealer needed over a stained floor." },
      ] },
    ],
  },
  {
    num: "02", id: "sealers", title: "Water-Based Sealers",
    brands: [
      { brand: "LOBA", products: [
        { img: easyprime, brand: L, name: "EasyPrime", pill: "Sealer · Fast-Drying", desc: "A polyurethane-acrylate water-based sealer with rapid drying and no lap marks — even on critical wood species. Reduces side bonding and the white-line effect.",
          chips: [{ label: "Compatible with", items: ["All LOBA Water-Based Finishes"] }, { label: "Best for", items: ["Hardwood Floors"] }] },
      ] },
      { brand: "Bona", products: [
        { img: natural, brand: B, name: "Bona NaturalSeal®", pill: "Sealer · Raw Wood Look", desc: "Retains the appearance of unfinished, freshly sanded wood using a small amount of white pigment, while reducing side bonding and tannin bleed.", swatch: naturalSw,
          chips: [{ label: "Visual effect", items: ["Natural / Unfinished Wood"] }, { label: "Best for", items: ["Matte Natural Floors", "Modern Interiors"] }] },
        { img: nordic, brand: B, name: "Bona NordicSeal®", pill: "Sealer · Whitewashed", desc: "Creates a Scandinavian whitewashed look — from a light whitewash to a more pronounced appearance — with twice the white pigment of NaturalSeal.", swatch: nordicSw,
          chips: [{ label: "Visual effect", items: ["Scandinavian White-Wash"] }, { label: "Best for", items: ["Light Nordic Interiors"] }] },
        { img: amberseal, brand: B, name: "Bona AmberSeal®", pill: "Sealer · Warm Amber", desc: "Creates a warm, rich, oil-modified appearance while resisting progressive yellowing or darkening with age.", swatch: amberSw,
          chips: [{ label: "Visual effect", items: ["Warm / Golden Amber"] }, { label: "Best for", items: ["Traditional interiors", "Oiled look"] }] },
        { img: intense, brand: B, name: "Bona IntenseSeal®", pill: "Sealer · Wet Look", desc: "A unique “wet look” sealer that pops stain colors and develops a vibrant, deep natural tone in each wood species.", swatch: intenseSw,
          chips: [{ label: "Visual effect", items: ["Deep / Rich Wet Look"] }, { label: "Best for", items: ["Stained Floors", "Grain Enhancement"] }] },
      ] },
    ],
  },
  {
    num: "03", id: "additives", title: "Additives",
    brands: [
      { brand: "LOBA", products: [
        { img: amberizer, brand: L, name: "Amberizer", pill: "Additive · Amber Tone", desc: "Achieves the traditional look of an aged oil-modified polyurethane finish with water-based coatings.",
          chips: [{ label: "Compatible with", items: ["All LOBA Water-Based Finishes"] }, { label: "Best for", items: ["Dark Wood Species"] }],
          note: "For light wood species, LOBA recommends consultation before use." },
        { img: whitener, brand: L, name: "Whitener", pill: "Additive · Brightening", desc: "Added to LOBA water-based sealers and finishes for a smooth brightening of wood floors. Intensity is controlled by applying one or more layers.",
          chips: [{ label: "Compatible with", items: ["LOBA Water-Based Sealers & Finishes"] }, { label: "Best for", items: ["White & Light Floors"] }] },
        { img: uv, brand: L, name: "UV-Protect", pill: "Additive · UV Protection", desc: "Helps protect light-colored wood species against yellowing and darkening from sunlight — so color changes are less noticeable when rugs or furniture are moved.",
          chips: [{ label: "Compatible with", items: ["All LOBA Water-Based Finishes"] }, { label: "Best for", items: ["Maple, Birch & Light Species"] }] },
      ] },
    ],
  },
];
