// Site-wide SEO settings used by src/lib/seo-edge.ts, /sitemap.xml and /llms.txt.
export type SeoPage = { path: string; title: string; section?: string; desc?: string; lastmod?: string };
import { REG } from "@/lib/registry";

export const SEO = {
  origin: "https://cabinvolt.shop",
  pagesDevHost: "cabin-volt.pages.dev",
  name: "CabinVolt",
  description: "Check whether a power bank can fly: watt-hour limits, airline power bank rules and dated recall/safety notices, each linked to its source.",
  lang: "en",
  logo: "/favicon.svg" as string | undefined,
  sameAs: [] as string[],
  sectionNames: {} as Record<string, string>,
  keepTrailingSlash: false,
};

export const LLMS_NOTES: string[] = [
  "Rules change; every airline and model record links to its primary source and review date.",
  "Final acceptance is always at the discretion of the airline and security staff."
];

export function seoPages(): SeoPage[] {
  return [
    { path: "/", title: "CabinVolt — Can this power bank fly?", section: "Tools" },
    { path: "/calculator", title: "Power bank watt-hour (Wh) calculator", section: "Tools" },
    { path: "/airlines", title: "Airline power bank rules", section: "Airline rules" },
    { path: "/models", title: "Recalled and flagged power bank models", section: "Power bank models" },
    { path: "/methodology", title: "Methodology", section: "About the data" },
    { path: "/sources", title: "Sources", section: "About the data" },
    ...REG.airlines.map((a) => ({ path: `/airlines/${a.id}`, title: `${a.name} power bank rules`, section: "Airline rules" })),
    ...REG.models.map((m) => ({ path: `/models/${m.id}`, title: `${m.name} — flight and recall status`, section: "Power bank models", desc: m.description })),
  ];
}
