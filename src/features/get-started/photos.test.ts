// @ts-nocheck -- follows the project's Vitest test convention.
import { describe, expect, it } from "vitest";
import { validateProjectPhoto } from "./photos";
import { estimateSchema, sendEstimate } from "./estimate";
const photo = { name: "floor.jpg", type: "image/jpeg", size: 10 * 1024 * 1024 };
describe("Optional project photo rules", () => {
  it("accepts at most five photos", () => {
    expect(validateProjectPhoto(photo, 4)).toBeNull();
    expect(validateProjectPhoto(photo, 5)).not.toBeNull();
  });
  it("accepts 10 MB and rejects larger images", () => {
    expect(validateProjectPhoto(photo, 0)).toBeNull();
    expect(validateProjectPhoto({ ...photo, size: photo.size + 1 }, 0)).not.toBeNull();
  });
  it("accepts JPEG PNG WebP only with matching types", () => {
    for (const [name, type] of [["f.jpeg", "image/jpeg"], ["f.png", "image/png"], ["f.webp", "image/webp"]]) expect(validateProjectPhoto({ ...photo, name, type }, 0)).toBeNull();
    for (const [name, type] of [["f.gif", "image/gif"], ["f.svg", "image/svg+xml"], ["f.png", "image/jpeg"]]) expect(validateProjectPhoto({ ...photo, name, type }, 0)).not.toBeNull();
  });
  it("rejects HEIC with iPhone-specific feedback", () => {
    expect(validateProjectPhoto({ ...photo, name: "f.HEIC", type: "image/heic" }, 0)).toContain("iPhone");
  });
  it("rejects empty files", () => { expect(validateProjectPhoto({ ...photo, size: 0 }, 0)).not.toBeNull(); });
  it("permits submission without images and strips files from the form boundary", async () => {
    const form = { name: "Synthetic Test", phone: "7325550123", email: "", service: "refinishing", location: "07728", message: "", consent: true, photos: [photo] };
    expect(estimateSchema.parse(form)).not.toHaveProperty("photos");
    const inserted: unknown[] = [], notified: unknown[] = [];
    await sendEstimate(form, {}, async (data) => { inserted.push(data); }, async (data) => { notified.push(data); return true; });
    expect(inserted).toHaveLength(1); expect(notified).toHaveLength(1);
    expect(inserted[0]).not.toHaveProperty("photos"); expect(notified[0]).not.toHaveProperty("photos");
  });
});