/**
 * All user-facing copy for the /get-started wizard.
 * Keys are i18n-ready: a PT dictionary can be added later and swapped by locale.
 */
export const gsCopy = {
  intro: {
    headline: "Let's Bring Your Floors Back to Life",
    body: "We're honored you're considering AXO Floors for your project. This quick 2-minute form helps us understand your needs so we can reach out with real answers — not a generic sales pitch.",
    cta: "Start",
  },
  nav: {
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    submitting: "Sending...",
  },
  fields: {
    name: { label: "What's your Name?", placeholder: "First and last name", error: "Please enter your name." },
    phone: { label: "What's the best phone number to reach you?", placeholder: "(555) 123-4567", error: "Please enter a valid 10-digit US phone number." },
    email: { label: "What's your email address?", placeholder: "you@example.com", error: "Please enter a valid email address." },
    address: {
      label: "Where is the project located?",
      placeholder: "Start typing your address...",
      helper: "We serve New Jersey, New York and Pennsylvania.",
      error: "Please select an address from the dropdown",
      errorEmpty: "Please enter the project address.",
    },
  },
  attribution: { label: "How did you find us?", error: "Please pick one option." },
  service: {
    label: "What type of service do you need?",
    helper: "Choose the option that best describes your project",
    error: "Please pick one option.",
  },
  finishScope: {
    label: "Is this finish for new wood we'll install, or for existing floors?",
    helper: "This decides which checks we need to run",
    error: "Please pick one option.",
  },
  consult: {
    type: { label: "What type of consultation works best for you?", error: "Please pick one option." },
    introTitle: "Meet your consultant",
    consultantName: "AXO Floors Consultation Team",
    consultantRole: "NWFA-informed hardwood specialists",
    bio: "Sit down with the AXO team and get straight answers on wood species, finishes, moisture concerns, and realistic budgets — backed by NWFA standards and the family legacy behind the AXO name.",
    topics: { label: "What would you like to cover in this call?", placeholder: "Tell us what's on your mind..." },
  },
  qual: {
    wishlist: { label: "Tell us about your dream floors", placeholder: "Species, color, finish, inspiration..." },
    timeline: { label: "When are you looking to start?", error: "Please pick one option." },
    budget: { label: "What's your estimated budget?", helper: "Drag to set a rough range — this just helps us plan." },
    currentFloor: { label: "What's currently on the floors?", error: "Please pick one option." },
    condition: { label: "What condition are your hardwood floors in?", error: "Please pick one option." },
    areas: {
      label: "Which areas are included?",
      helper: "Select all that apply.",
      error: "Please select at least one area.",
    },
    stairs: {
      label: "Any stairs included in this project?",
      error: "Please let us know if stairs are included.",
      countLabel: "How many steps?",
      countError: "Please select how many steps.",
    },
    sqft: { label: "Approximate square footage of the project area?", notSure: "Not sure", error: "Please enter a square footage or check \"Not sure\"." },
    propertyType: { label: "What type of property is this?", error: "Please pick one option." },
    furnished: { label: "Will the space be furnished during the project?", error: "Please pick one option." },
    homeAge: { label: "Approximate age of the home?", error: "Please pick one option." },
  },
  consent: {
    label: "Almost done",
    text: "I consent to being contacted by AXO Floors by phone, text, or email regarding my project.",
    error: "Please provide your consent so we can reach out.",
  },
  thanks: {
    headline: "Thank You — You're in Good Hands",
    body: "We know that was a lot of questions — but it means our first conversation will be about YOUR project, not generic estimates. Someone from the AXO team will reach out shortly.",
    cta: "Return Home",
  },
  errorToast: {
    title: "We couldn't send your request",
    description: "Please try again, or call us at (732) 351-8653.",
  },
} as const;

export const ATTRIBUTION_OPTIONS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "Pinterest",
  "Google Search",
  "Nextdoor",
  "Referral (friend/family)",
  "Contractor / Builder referral",
  "Yard Sign",
  "Vehicle Wrap",
  "Other",
] as const;

export const SERVICE_OPTIONS = [
  { value: "installation", label: "New Hardwood Installation", hint: "Free in-home estimate" },
  { value: "refinishing", label: "Sanding & Refinishing", hint: "99% dustless system, free estimate" },
  { value: "repair", label: "Repair & Restoration", hint: "Water damage, boards, patches" },
  { value: "stairs", label: "Stairs & Custom Work", hint: "Treads, borders, inlays" },
  { value: "consultation", label: "Expert Consultation", hint: "Wood selection, finishes, project planning" },
] as const;

/** Guided service question (adapted from the /quiz step 1). */
export const SERVICE_TYPE_OPTIONS = [
  { value: "new-installation", label: "New Installation", hint: "Installing new flooring" },
  { value: "floor-refinish", label: "Refinishing (Sand & Finish)", hint: "Refinishing existing floors" },
  { value: "install-plus-refinish", label: "Installation + Refinishing", hint: "Both — install new and refinish" },
  { value: "not-sure", label: "Not sure / Need guidance", hint: "Talk to an expert first" },
] as const;

export const FINISH_SCOPE_OPTIONS = [
  { value: "new-floor", label: "For the new floor being installed", hint: "Finish only the floor we'll install" },
  { value: "existing", label: "For existing floors", hint: "Refinish floors already in place" },
  { value: "both", label: "Both", hint: "New install + refinish existing areas" },
  { value: "not-sure", label: "Not sure", hint: "We'll inspect and recommend" },
] as const;

export const CONSULT_TYPE_OPTIONS = [
  { value: "video", label: "Video Call", hint: "Screen-share your inspiration photos" },
  { value: "phone", label: "Phone Call", hint: "Quick and simple" },
  { value: "in_home", label: "In-Home Visit ($)", hint: "Paid on-site consultation" },
] as const;

export const TIMELINE_OPTIONS = ["ASAP", "Within 1 month", "1–3 months", "3–6 months", "Just researching"] as const;

export const CURRENT_FLOOR_OPTIONS = [
  "Carpet",
  "Tile",
  "Laminate or Vinyl",
  "Old hardwood",
  "Bare subfloor / concrete",
  "Mixed",
  "New construction (no existing flooring — new build)",
] as const;

export const CONDITION_OPTIONS = [
  "Light wear, just dull",
  "Scratches & stains",
  "Deep damage or pet stains",
  "Previously refinished, not sure of thickness",
] as const;

export const AREA_OPTIONS = [
  "Living room",
  "Kitchen",
  "Bedrooms",
  "Hallways",
  "Stairs",
  "Whole floor",
  "Whole house",
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "Single-family home",
  "Condo / Apartment",
  "Townhouse",
  "Commercial space",
  "Rental / Investment property",
] as const;

export const FURNISHED_OPTIONS = [
  "Empty",
  "Partially furnished",
  "Fully furnished — need help moving furniture",
] as const;

export const HOME_AGE_OPTIONS = ["Under 10 years", "10–30 years", "30–60 years", "60+ years", "Not sure"] as const;

export const STAIRS_COUNT_OPTIONS = [
  { value: "1-5", label: "1 – 5 steps" },
  { value: "6-11", label: "6 – 11 steps" },
  { value: "12-20", label: "12 – 20 steps" },
  { value: "20-plus", label: "20+ steps" },
] as const;

// ─── Quiz-parity branch options (mirrors /quiz) ────────────
export const QUIZ_COPY = {
  floorType: { label: "What type of flooring are you interested in?", helper: "This helps us choose the right installation method and prep.", error: "Please select a flooring type." },
  materials: { label: "Do you already have the flooring picked out and on order?", helper: "This affects scheduling, delivery timing, and the install plan.", error: "Please pick an option.", deliveredLabel: "Is the material already delivered on-site?", deliveredError: "Please tell us if the material is already delivered." },
  location: { label: "Where will this flooring be installed?", helper: "Different locations may require different approaches", error: "Please select the location type." },
  subfloorGrade: { label: "Quick technical check", helper: "Two short questions that decide method, prep and warranty", subfloorLabel: "What's under this floor?", belowGradeLabel: "Is this space below grade (basement)?", error: "Please answer both questions." },
  condition: { label: "What's the current condition of your floors?", helper: "This helps us determine the best refinishing approach", error: "Please select the current condition." },
  wood: { label: "What type of wood flooring do you currently have?", helper: "This helps us choose the right refinishing approach", error: "Please select your wood type." },
  living: { label: "Will you be living in the home during the refinishing?", helper: "Affects scheduling, dust control, and finish curing time", error: "Please answer the question." },
  area: { label: "What's the approximate area for this project?", helper: "Choose from common sizes or enter a custom amount", customLabel: "Or enter custom square footage", error: "Please specify the area size." },
  colorChange: { label: "Are you planning to change the color of your floors?", helper: "This affects the refinishing process and cost", error: "Please specify color preference." },
  timeline: { label: "When would you like to start the project?", helper: "This helps us schedule and prepare", error: "Please select a timeline." },
  budget: { label: "What's your budget range for this project?", helper: "This helps us provide accurate recommendations", error: "Please select a budget range." },
} as const;

export const FLOOR_TYPE_OPTIONS = [
  { value: "hardwood", label: "Hardwood", hint: "Classic and durable solid wood flooring" },
  { value: "laminate", label: "Laminate", hint: "Affordable and resilient synthetic flooring" },
  { value: "vinyl", label: "Vinyl", hint: "Water-resistant and low maintenance" },
  { value: "custom", label: "Custom", hint: "Unique patterns and materials" },
] as const;

export const MATERIALS_OPTIONS = [
  { value: "customer_has", label: "Yes — I already bought it", hint: "We'll verify compatibility before scheduling." },
  { value: "axo_supply", label: "Not yet — I want AXO to supply it", hint: "We'll confirm product + lead time in writing before ordering." },
  { value: "needs_help", label: "Not sure — I need help choosing", hint: "We'll guide you to the right product for your subfloor and traffic." },
] as const;

export const MATERIAL_DELIVERED_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const LOCATION_OPTIONS = [
  { value: "residential", label: "Residential Home" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial Space" },
] as const;

export const SUBFLOOR_OPTIONS = [
  { value: "concrete", label: "Concrete slab" },
  { value: "wood", label: "Plywood / wood" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const BELOW_GRADE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const QUIZ_CONDITION_OPTIONS = [
  { value: "light-wear", label: "Light Wear", hint: "Minor scratches and dullness" },
  { value: "moderate-wear", label: "Moderate Wear", hint: "Visible scratches and some damage" },
  { value: "heavy-wear", label: "Heavy Wear", hint: "Deep scratches and significant damage" },
  { value: "damaged", label: "Damaged", hint: "Requires board replacement" },
] as const;

export const WOOD_TYPE_OPTIONS = [
  { value: "oak", label: "Oak" },
  { value: "maple", label: "Maple" },
  { value: "pine", label: "Pine" },
  { value: "not-sure", label: "Not Sure" },
] as const;

export const LIVING_OPTIONS = [
  { value: "yes", label: "Yes", hint: "We'll plan low-VOC finishes & ventilation" },
  { value: "no", label: "No", hint: "Faster cure & full prep window" },
  { value: "not-sure", label: "Not sure", hint: "We'll discuss options" },
] as const;

export const AREA_PRESETS = [
  { value: "200", label: "Small Room", hint: "~200 sq ft" },
  { value: "400", label: "Medium Room", hint: "~400 sq ft" },
  { value: "600", label: "Large Room", hint: "~600 sq ft" },
  { value: "1200", label: "Whole Floor", hint: "1200+ sq ft" },
] as const;

export const COLOR_CHANGE_OPTIONS = [
  { value: "keep-same", label: "Keep Same Color", hint: "Maintain current appearance" },
  { value: "go-lighter", label: "Go Lighter", hint: "Brighten the space" },
  { value: "go-darker", label: "Go Darker", hint: "Add richness and depth" },
  { value: "need-consultation", label: "Need Consultation", hint: "Professional recommendation" },
] as const;

export const QUIZ_TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within 1 month" },
  { value: "3-months", label: "Within 3 months" },
  { value: "planning", label: "Just planning" },
] as const;

export const QUIZ_BUDGET_OPTIONS = [
  { value: "under-2k", label: "Up to $2,000" },
  { value: "2k-5k", label: "$2,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-plus", label: "$10,000+" },
] as const;
