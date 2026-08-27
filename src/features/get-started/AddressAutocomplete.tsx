import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

const GOOGLE_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_PLACES_API_KEY ||
  "";

let loaderPromise: Promise<boolean> | null = null;

function loadPlaces(): Promise<boolean> {
  if (!GOOGLE_KEY) return Promise.resolve(false);
  if ((window as any).google?.maps?.places) return Promise.resolve(true);
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_KEY)}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(Boolean((window as any).google?.maps?.places));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return loaderPromise;
}

interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string, meta: { verified: boolean; city?: string; zip?: string }) => void;
  onEnter?: () => void;
  invalid?: boolean;
}

interface Suggestion {
  label: string;
  city?: string;
  zip?: string;
  state?: string;
}

const ALLOWED_STATES = ["NJ", "NY", "PA", "New Jersey", "New York", "Pennsylvania"];

/** Free OpenStreetMap-based address suggestions (no API key required). */
async function fetchSuggestions(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en&lat=40.3&lon=-74.3`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const json = await res.json();
  const feats: any[] = json?.features ?? [];
  return feats
    .map((f) => {
      const p = f.properties ?? {};
      if (p.countrycode && p.countrycode !== "US") return null;
      const street = [p.housenumber, p.street || p.name].filter(Boolean).join(" ");
      const city = p.city || p.town || p.village || p.county || "";
      const label = [street, city, p.state, p.postcode].filter(Boolean).join(", ");
      if (!label) return null;
      return { label, city, zip: p.postcode, state: p.state } as Suggestion;
    })
    .filter(Boolean)
    .filter((s) => !(s as Suggestion).state || ALLOWED_STATES.includes((s as Suggestion).state!)) as Suggestion[];
}

/**
 * Address field with autocomplete.
 * Uses Google Places when a key is configured, otherwise falls back to a
 * free OpenStreetMap (Photon) suggestion list so the lead still gets
 * type-ahead help. Typed addresses remain accepted as a last resort.
 */
export default function AddressAutocomplete({ value, placeholder, onChange, onEnter, invalid }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placesReady, setPlacesReady] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [justPicked, setJustPicked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPlaces().then((ok) => {
      if (cancelled || !ok || !inputRef.current) return;
      const g = (window as any).google;
      const ac = new g.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: ["us"] },
        fields: ["formatted_address", "address_components"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const components: any[] = place?.address_components ?? [];
        const get = (type: string) => components.find((c) => c.types?.includes(type));
        const state = get("administrative_area_level_1")?.short_name;
        const allowed = ["NJ", "NY", "PA"];
        const formatted = place?.formatted_address || inputRef.current?.value || "";
        onChange(formatted, {
          verified: Boolean(place?.formatted_address) && allowed.includes(state),
          city: get("locality")?.long_name || get("sublocality")?.long_name || "",
          zip: get("postal_code")?.long_name || "",
        });
      });
      setPlacesReady(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback suggestions (only when Google Places isn't available)
  useEffect(() => {
    if (placesReady || justPicked) return;
    const q = value.trim();
    if (q.length < 4) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(() => {
      fetchSuggestions(q, controller.signal)
        .then((list) => {
          setSuggestions(list);
          setOpen(list.length > 0);
        })
        .catch(() => {
          /* offline / blocked — plain typing still works */
        });
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [value, placesReady, justPicked]);

  const pick = (s: Suggestion) => {
    setJustPicked(true);
    setOpen(false);
    setSuggestions([]);
    onChange(s.label, { verified: true, city: s.city, zip: s.zip });
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        autoFocus
        value={value}
        autoComplete="off"
        inputMode="text"
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          setJustPicked(false);
          onChange(e.target.value, {
            // Google validates on selection; without it we accept a typed address
            verified: placesReady ? false : e.target.value.trim().length > 5,
          });
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (open && suggestions[0]) {
              pick(suggestions[0]);
              return;
            }
            onEnter?.();
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className="h-14 text-lg"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {suggestions.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-muted/60"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="leading-snug">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
