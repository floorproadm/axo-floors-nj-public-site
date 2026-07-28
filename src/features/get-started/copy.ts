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
    firstName: { label: "What's your first name?", placeholder: "First name", error: "Please enter your first name." },
    lastName: { label: "And your last name?", placeholder: "Last name", error: "Please enter your last name." },
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
  service: { label: "What can we help you with?", error: "Please pick one option." },
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
    areas: { label: "Which areas are included?", helper: "Select all that apply.", error: "Please select at least one area." },
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
