// Partner / affiliate slots. A slot stays invisible until its url is set.
// Add your tracking link to "url" (and the programme name to "partner"), commit, push: Cloudflare deploys it.
// Per-item links (e.g. one product page per device) go in OFFER_LINKS keyed by item slug; they override the slot url.
export type OfferSlotId = "travel-power-bank";
export type OfferSlot = { heading: string; body: string; cta: string; url: string; partner: string };

export const OFFER_SLOTS: Record<OfferSlotId, OfferSlot> = {
  "travel-power-bank": { heading: "Travel power banks under 100 Wh", body: "Choose a model with the Wh rating printed on the case, and check it is not on a recall list before you fly.", cta: "Browse power banks", url: "", partner: "" },
};

export const OFFER_LINKS: Record<string, string> = {};
