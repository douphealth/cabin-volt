// Partner / affiliate slots. A slot stays invisible until its url is set.
// Add your tracking link to "url" (and the programme name to "partner"), commit, push: Cloudflare deploys it.
// Per-item links (e.g. one product page per device) go in OFFER_LINKS keyed by item slug; they override the slot url.
export type OfferSlotId = never;
export type OfferSlot = { heading: string; body: string; cta: string; url: string; partner: string };

export const OFFER_SLOTS: Record<OfferSlotId, OfferSlot> = {
  never: { heading: "Travel power banks under 100 Wh", body: "Choose a model with the Wh rating printed on the case, and check it is not on a recall list before you fly.", cta: "Browse power banks", url: "", partner: "" },
};

export const OFFER_LINKS: Record<string, string> = {};

// Amazon Associates: set tag to this site's tracking ID (e.g. "mysite-20") and domain to your Associates store.
// Empty tag = no Amazon links are rendered anywhere.
export const AMAZON = { tag: "papalex-cabinvolt-20", domain: "www.amazon.com" };
