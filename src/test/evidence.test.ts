import { describe, expect, it } from "vitest";
import { REG, hasDocumentedOnboardUse } from "@/lib/registry";
import { evidenceAudit, evidenceFor } from "@/lib/evidence";
import { evaluateLookup } from "@/lib/logic";

describe("evidence integrity", () => {
  it("does not present unconfirmed onboard use as permission", () => {
    expect(hasDocumentedOnboardUse({ use: "unconfirmed" })).toBe(false);
    expect(hasDocumentedOnboardUse({ use: "unknown" })).toBe(false);
    expect(hasDocumentedOnboardUse({ use: "no" })).toBe(false);
    expect(hasDocumentedOnboardUse({ use: "restricted" })).toBe(true);
  });
  it("accounts for every source once without treating retrieval as verification", () => {
    expect(evidenceAudit.records.length).toBe(Object.keys(REG.sources).length);
    expect(new Set(evidenceAudit.records.map((record) => record.id)).size).toBe(evidenceAudit.records.length);
    for (const key of Object.keys(REG.sources)) expect(evidenceFor(key)).toBeDefined();
    for (const record of evidenceAudit.records.filter((item) => item.status === "reviewed")) {
      expect(record.httpStatus).toBe(200);
      expect(record.excerpt?.length).toBeGreaterThan(20);
      expect(record.applicability?.length).toBeGreaterThan(20);
    }
  });
  it("resolves every model, airline and update reference", () => {
    const keys = [...REG.models.flatMap((model) => model.sources ?? []), ...REG.airlines.map((airline) => airline.source), ...REG.updates.map((update) => update.source)];
    for (const key of keys) expect(REG.sources[key]).toBeDefined();
  });
  it("keeps an unresolved India restriction precaution visible", () => {
    const result = evaluateLookup({ modelText: "MK-PB-04", from: "IN", whInput: "50" }, REG, new Date("2026-11-17"));
    expect(result.reasons.some((reason: { code: string }) => reason.code === "india-ban")).toBe(true);
    expect(result.severity).not.toBe("info");
    expect(evidenceFor("nepal_mobikins")?.status).toBe("needs-review");
  });
  it("limits Lufthansa power banks to 100 Wh with no approval path", () => {
    const over = evaluateLookup({ modelText: "", airlineId: "lufthansa", whInput: "120" }, REG, new Date("2026-11-17"));
    expect(over.reasons.some((reason: { code: string }) => reason.code === "airline-wh-exceeded")).toBe(true);
    expect(over.severity).toBe("danger");
  });
  it("keeps blocked sources explicitly unverified", () => {
    expect(evidenceFor("wizz26")?.status).toBe("unavailable");
    expect(evidenceFor("airfrance26")?.status).toBe("unavailable");
  });
});
