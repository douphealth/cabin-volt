import registry from "@/data/registry.json";
import i18n from "@/data/i18n.json";

export type Source = { name: string; url: string; date: string | null; type: string; independentlyReviewed?: string; reviewMethod?: string };
export type Model = { id: string; brand: string; model: string; name: string; aliases?: string[]; issue: string; scope: string; date: string; description: string; wh?: number | null; sources?: string[]; serialPrefixes?: string[] };
export type Airline = { id: string; name: string; short: string; iata: string; limit: number | null; maxWh: number | null; maxExclusive: boolean; large: string; use: string; recharge: string; coverage: string; source: string; note: string; bannedModels?: string[]; banRecalled?: boolean };
export type Update = { date: string; title: string; description: string; source: string; model?: string };

export const REG = registry as unknown as {
  edition: string; coverageNote: string; sources: Record<string, Source>; models: Model[]; airlines: Airline[]; updates: Update[];
  provenance: { snapshotAsOf: string; lastManualReview: string; limitations: string[]; authorityOrder: string[] };
};
const EN = (i18n as unknown as { en: Record<string, string> }).en;
export const t = (k: string, fallback = "") => EN[k] ?? fallback;
export const reasonText = (code: string) => t(`reason_${code}`, code);
export const levelLabel = { danger: "Do not fly with it", caution: "Needs verification", info: "No listed issue" } as const;
export const scopeLabel = (s: string) => ({ all: "All units", "serial-check": "Serial check", "serial-prefix": "Serial prefix", "batch-check": "Batch check", "batch-date": "Manufacture date", "no-date-code": "Condition-based", "seller-us": "US seller", route: "Route ban" } as Record<string, string>)[s] ?? s;
export const yesNo = (v: string) => ({ no: "Not allowed", yes: "Allowed", limited: "Limited", approval: "With approval", unknown: "Unverified", unconfirmed: "Unconfirmed", restricted: "Restricted" } as Record<string, string>)[v] ?? v;
