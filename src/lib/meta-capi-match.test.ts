// @ts-nocheck -- follows the project's bunx Vitest test convention.
import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import {
  buildHashedMatchFields,
  normalizeCity,
  normalizeEmail,
  normalizePhone,
  normalizeZip,
  splitName,
} from "./meta-capi-match";

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const HEX_64 = /^[0-9a-f]{64}$/;

describe("Meta CAPI matching normalization", () => {
  it("trims and lowercases email", () => {
    expect(normalizeEmail("  Becky@Example.COM ")).toBe("becky@example.com");
  });

  it("keeps digits only and prepends the US country code to 10-digit numbers", () => {
    expect(normalizePhone("(732) 351-8653")).toBe("17323518653");
    expect(normalizePhone("+1 732 351 8653")).toBe("17323518653");
  });

  it("splits a full name into lowercase, punctuation-free first and last tokens", () => {
    expect(splitName("Becky Cordero")).toEqual({ fn: "becky", ln: "cordero" });
    expect(splitName("  Mary-Jane   Watson ")).toEqual({ fn: "maryjane", ln: "watson" });
    expect(splitName("Madonna")).toEqual({ fn: "madonna" });
    expect(splitName("   ")).toEqual({});
  });

  it("keeps the first 5 zip digits", () => {
    expect(normalizeZip("07728-1234")).toBe("07728");
    expect(normalizeZip("07728")).toBe("07728");
  });

  it("lowercases city and removes spaces", () => {
    expect(normalizeCity(" Jersey City ")).toBe("jerseycity");
  });
});

describe("buildHashedMatchFields", () => {
  it("hashes every field as 64-char hex matching independent SHA-256", async () => {
    const fields = await buildHashedMatchFields({
      email: "Becky@Example.com",
      phone: "(732) 351-8653",
      name: "Becky Cordero",
      zip: "07728",
      city: "Jersey City",
      leadId: "123e4567-e89b-42d3-a456-426614174000",
    });
    for (const value of Object.values(fields)) expect(value).toMatch(HEX_64);
    expect(fields.em).toBe(sha("becky@example.com"));
    expect(fields.ph).toBe(sha("17323518653"));
    expect(fields.fn).toBe(sha("becky"));
    expect(fields.ln).toBe(sha("cordero"));
    expect(fields.zp).toBe(sha("07728"));
    expect(fields.ct).toBe(sha("jerseycity"));
    expect(fields.country).toBe(sha("us"));
    expect(fields.external_id).toBe(sha("123e4567-e89b-42d3-a456-426614174000"));
  });

  it("omits empty fields instead of hashing empty strings", async () => {
    const fields = await buildHashedMatchFields({ name: "Becky Cordero" });
    expect(fields.em).toBeUndefined();
    expect(fields.ph).toBeUndefined();
    expect(fields.zp).toBeUndefined();
    expect(fields.ct).toBeUndefined();
    expect(fields.external_id).toBeUndefined();
    expect(fields.fn).toBe(sha("becky"));
    expect(fields.country).toBe(sha("us"));
  });
});
