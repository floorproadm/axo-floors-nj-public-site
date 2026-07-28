import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

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

/**
 * Address field with Google Places Autocomplete restricted to NJ / NY / PA.
 * When no Places key is configured the field degrades to a plain text input
 * (typed addresses are accepted) so the wizard never becomes unusable.
 */
export default function AddressAutocomplete({ value, placeholder, onChange, onEnter, invalid }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placesReady, setPlacesReady] = useState(false);

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

  return (
    <Input
      ref={inputRef}
      autoFocus
      value={value}
      autoComplete="off"
      inputMode="text"
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      onChange={(e) =>
        onChange(e.target.value, { verified: placesReady ? false : e.target.value.trim().length > 5 })
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter?.();
        }
      }}
      className="h-14 text-lg"
    />
  );
}
