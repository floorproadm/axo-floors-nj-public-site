export const MAX_PROJECT_PHOTOS = 5;
export const MAX_PROJECT_PHOTO_BYTES = 10 * 1024 * 1024;
export type PhotoCandidate = { name: string; type: string; size: number };

// Local preview validation only. No storage or submission boundary accepts these files.
export function validateProjectPhoto(file: PhotoCandidate, count: number): string | null {
  if (count >= MAX_PROJECT_PHOTOS) return "You can select up to 5 photos. Remove one before adding another.";
  if (/\.(heic|heif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type)) return "HEIC photos aren't supported here. On iPhone, choose or export a JPEG photo, or use Camera → Formats → Most Compatible for new photos.";
  const formats: Record<string, RegExp> = { "image/jpeg": /\.jpe?g$/i, "image/png": /\.png$/i, "image/webp": /\.webp$/i };
  if (!formats[file.type]?.test(file.name)) return "Please choose a JPEG, PNG, or WebP photo.";
  if (file.size <= 0) return "This photo is empty. Please choose another photo.";
  if (file.size > MAX_PROJECT_PHOTO_BYTES) return "Each photo must be 10 MB or smaller.";
  return null;
}