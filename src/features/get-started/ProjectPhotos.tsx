import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_PROJECT_PHOTOS, validateProjectPhoto } from "./photos";

type Preview = { id: number; url: string };

export function ProjectPhotos({ disabled, onCountChange }: { disabled: boolean; onCountChange: (count: number) => void }) {
  const [photos, setPhotos] = useState<Preview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [preparing, setPreparing] = useState(false);
  const current = useRef<Preview[]>([]);
  const nextId = useRef(0);
  const picker = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; current.current = []; }; }, []);

  async function select(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setPreparing(true);
    const problems: string[] = [];
    for (const file of files) {
      if (!mounted.current) break;
      const error = validateProjectPhoto(file, current.current.length);
      if (error) { problems.push(error); continue; }
      try {
        // Existing image policy allows data: but not blob:; keep previews in memory
        // without altering security headers or persisting images anywhere.
        const url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("unreadable"));
          reader.onerror = () => reject(new Error("unreadable"));
          reader.readAsDataURL(file);
        });
        if (!mounted.current) break;
        const image = new Image(); image.src = url;
        await image.decode();
        if (!mounted.current) break;
        current.current = [...current.current, { id: nextId.current++, url }];
      } catch { problems.push("This photo couldn't be opened. Please choose another JPEG, PNG, or WebP image."); }
    }
    if (!mounted.current) return;
    setPhotos([...current.current]); onCountChange(current.current.length);
    setErrors([...new Set(problems)]); setPreparing(false);
  }
  function remove(id: number) {
    current.current = current.current.filter((item) => item.id !== id);
    setPhotos([...current.current]); onCountChange(current.current.length); setErrors([]);
  }
  return (
    <section aria-labelledby="photos-heading" className="border-t border-border pt-5">
      <div className="flex items-center justify-between gap-3"><h2 id="photos-heading" className="text-sm font-medium">Add Photos <span className="font-normal text-muted-foreground">(optional)</span></h2><span role="status" className="shrink-0 text-sm text-muted-foreground">{photos.length} of {MAX_PROJECT_PHOTOS}</span></div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Photos of your existing floors or project area help us prepare for our conversation.</p>
      <p id="photos-unavailable" className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong>Local preview only.</strong> Photo attachments are not available yet. Selected photos stay on this device and will not be uploaded or included in your estimate request.</p>
      <input ref={picker} type="file" multiple accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" aria-label="Choose project photos for local preview" aria-describedby="photos-unavailable photos-limits" onChange={select} disabled={disabled || preparing || photos.length >= MAX_PROJECT_PHOTOS} className="sr-only" tabIndex={-1} />
      <Button type="button" variant="outline" disabled={disabled || preparing || photos.length >= MAX_PROJECT_PHOTOS} onClick={() => picker.current?.click()} aria-describedby="photos-unavailable photos-limits" className="mt-3 min-h-12">{preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{preparing ? "Preparing previews…" : "Choose Photos — Preview Only"}</Button>
      <p id="photos-limits" className="mt-2 text-xs leading-relaxed text-muted-foreground">Up to 5 photos · JPEG, PNG, WebP · 10 MB each. HEIC is not supported.</p>
      {photos.length > 0 && <ul aria-label="Selected photo previews" className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">{photos.map((photo, index) => <li key={photo.id} className="relative aspect-square overflow-hidden rounded-md border border-border"><img src={photo.url} alt={`Project photo ${index + 1} local preview`} className="h-full w-full object-cover" /><Button type="button" variant="outline" size="icon" disabled={disabled || preparing} onClick={() => remove(photo.id)} aria-label={`Remove photo ${index + 1}`} title={`Remove photo ${index + 1}`} className="absolute right-1 top-1 h-10 w-10 bg-background"><X className="h-4 w-4" /></Button></li>)}</ul>}
      {errors.map((error) => <p key={error} role="alert" className="mt-2 text-sm leading-relaxed text-destructive">{error}</p>)}
    </section>
  );
}