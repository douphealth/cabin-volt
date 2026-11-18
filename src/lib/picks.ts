import type { Pick } from "@/components/AmazonPicks";

/** Every pick is under 100 Wh (3.7 V nominal), the cabin limit that needs no airline approval under ICAO rules. */
export const POWER_BANK_PICKS: Pick[] = [
  { label: "10,000 mAh power bank (≈37 Wh)", query: "10000mAh power bank", why: "Pocket-sized and far below the 100 Wh limit most airlines use." },
  { label: "20,000 mAh power bank (≈74 Wh)", query: "20000mAh power bank", why: "More charges while staying under 100 Wh. Check your airline's per-passenger count." },
  { label: "Laptop power bank under 100 Wh", query: "laptop power bank 99Wh", why: "The largest size most airlines accept without approval. Confirm the Wh printed on the unit." },
  { label: "Power bank travel case", query: "power bank travel case", why: "Helps keep terminals protected from short circuits in your carry-on." },
];
