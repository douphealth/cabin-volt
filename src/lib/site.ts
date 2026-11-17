import { evidenceAudit } from "@/lib/evidence";
import { REG, t, type Airline, type Model } from "@/lib/registry";

const BRAND = "CabinVolt";

function readSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  const origin = configured && configured.length > 0 ? configured : "https://cabinvolt.shop";
  return origin.replace(/\/+$/, "");
}

/** Production origin. Override with VITE_SITE_URL at build time. */
export const SITE_URL = readSiteUrl();

export const OG_IMAGE_PATH = "/og.png";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isoDate(value: string | null | undefined): string | undefined {
  return value && ISO_DATE.test(value) ? value : undefined;
}

/** App release shown in the header, when it is a calendar date. */
export function publishedOn(): string | undefined {
  return isoDate(REG.edition) ?? isoDate(REG.provenance.snapshotAsOf);
}

/** Sources page also shows the evidence-audit date. */
export function sourcesUpdatedOn(): string | undefined {
  const dates = [publishedOn(), isoDate(evidenceAudit.checkedAt)].filter((date): date is string =>
    Boolean(date),
  );
  return dates.sort().at(-1);
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalized}`;
}

export function pageTitle(primary: string): string {
  const clean = primary.replace(/\s+/g, " ").trim();
  const suffix = ` | ${BRAND}`;
  if (`${clean}${suffix}`.length <= 60) return `${clean}${suffix}`;
  const budget = 60 - suffix.length - 1;
  const cut = clean.slice(0, Math.max(budget, 1));
  const word = cut.lastIndexOf(" ");
  const base = (word > 12 ? cut.slice(0, word) : cut).trimEnd();
  return `${base}…${suffix}`;
}

/** Keep a meta description inside 160 characters without cutting a sentence that already fits. */
export function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  let end = 0;
  const marks = /[.!?](?=\s|$)/g;
  let match: RegExpExecArray | null;
  while ((match = marks.exec(clean))) {
    const next = match.index + 1;
    if (next <= max) end = next;
    else break;
  }
  if (end > 0) return clean.slice(0, end);
  const cut = clean.slice(0, max - 1);
  const word = cut.lastIndexOf(" ");
  const base = (word > 40 ? cut.slice(0, word) : cut).trimEnd();
  return `${base}…`;
}

export type Crumb = { name: string; path: string };

export function trail(...items: Crumb[]): Crumb[] {
  return [{ name: "Home", path: "/" }, ...items];
}

export const sections = {
  airlines: { name: "Airlines", path: "/airlines" },
  models: { name: "Recalls", path: "/models" },
  calculator: { name: "Wh calculator", path: "/calculator" },
  methodology: { name: "Method", path: "/methodology" },
  sources: { name: "Sources", path: "/sources" },
} as const;

export function homeDescription(): string {
  return `CabinVolt checks one power bank against ${REG.models.length} tracked model notices, ${REG.airlines.length} airline records and watt-hour limits in a dated dataset.`;
}

export function homeSummary(): string {
  return `${homeDescription()} The registry includes the ICAO rule in force since 27 March 2026: no more than 2 power banks, and no recharging them in flight. Checker inputs are evaluated on your device. This is not a live recall search or a flight clearance.`;
}

export function airlinesLead(): string {
  return "Dated records from each carrier's own pages. Strictest first when you sort by count or Wh. ICAO's maximum of two is not a promise. AEGEAN and Emirates each publish a stricter one-bank limit.";
}

export function modelsLead(): string {
  return "A curated selection, not a worldwide database. Some applicability remains under review. Not finding your model does not mean it's safe.";
}

export function calculatorLead(): string {
  return "Wh = mAh × nominal cell voltage ÷ 1000. Use the cell voltage on the label (usually 3.6–3.85 V), never the 5 V USB output.";
}

export function methodologyLead(): string {
  return 'Every verdict comes from the strictest applicable finding. Uncertainty is shown as "verify", never as "OK".';
}

export function sourcesLead(): string {
  return `Regulators, manufacturers, carriers and secondary reporting. Audit attempted ${evidenceAudit.checkedAt}; a successful retrieval alone is not policy verification. Re-check applicable sources before travel.`;
}

export function sourcesHeading(): string {
  return `${Object.keys(REG.sources).length} cited source records.`;
}

export const checkSteps = [
  "Match the exact model number against curated notices.",
  "Apply serial, batch, seller or route conditions.",
  "Compare watt-hours and count to ICAO and the airline.",
  "Return the strictest finding, with every source linked.",
] as const;

export function faqEntries(): { q: string; a: string }[] {
  return [1, 2, 3, 4, 5].map((n) => ({ q: t(`faq${n}_q`), a: t(`faq${n}_a`) }));
}

export function airlinesByName(): Airline[] {
  return [...REG.airlines].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

export function modelsByDate(): Model[] {
  return [...REG.models].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function sourceSections(): {
  type: string;
  entries: { key: string; source: (typeof REG.sources)[string] }[];
}[] {
  const sections: {
    type: string;
    entries: { key: string; source: (typeof REG.sources)[string] }[];
  }[] = [];
  for (const [key, source] of Object.entries(REG.sources)) {
    let section = sections.find((item) => item.type === source.type);
    if (!section) {
      section = { type: source.type, entries: [] };
      sections.push(section);
    }
    section.entries.push({ key, source });
  }
  return sections;
}

export type Indexable = { path: string; title: string; description: string };

export function homeIndexable(): Indexable {
  return {
    path: "/",
    title: pageTitle("Can this power bank fly?"),
    description: clip(homeDescription(), 160),
  };
}

export function airlinesIndexable(): Indexable {
  return {
    path: "/airlines",
    title: pageTitle("Airline power bank rules"),
    description: clip(airlinesLead(), 160),
  };
}

export function modelsIndexable(): Indexable {
  return {
    path: "/models",
    title: pageTitle("Power bank safety notices"),
    description: clip(modelsLead(), 160),
  };
}

export function calculatorIndexable(): Indexable {
  return {
    path: "/calculator",
    title: pageTitle("Power bank Wh calculator"),
    description: clip(calculatorLead(), 160),
  };
}

export function methodologyIndexable(): Indexable {
  return {
    path: "/methodology",
    title: pageTitle("How CabinVolt verifies"),
    description: clip(methodologyLead(), 160),
  };
}

export function sourcesIndexable(): Indexable {
  return {
    path: "/sources",
    title: pageTitle("Evidence sources"),
    description: clip(sourcesLead(), 160),
  };
}

export function airlineIndexable(airline: Airline): Indexable {
  return {
    path: `/airlines/${airline.id}`,
    title: pageTitle(`${airline.name} power bank rules`),
    description: clip(airline.note, 160),
  };
}

export function modelIndexable(model: Model): Indexable {
  return {
    path: `/models/${model.id}`,
    title: pageTitle(`${model.brand} ${model.model}`),
    description: clip(model.description, 160),
  };
}

export function indexableEntries(): Indexable[] {
  return [
    homeIndexable(),
    airlinesIndexable(),
    ...airlinesByName().map(airlineIndexable),
    modelsIndexable(),
    ...modelsByDate().map(modelIndexable),
    calculatorIndexable(),
    methodologyIndexable(),
    sourcesIndexable(),
  ];
}

type HeadMeta =
  { title: string } | { name: string; content: string } | { property: string; content: string };

export function contentHead(input: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  robots?: string;
  jsonLd?: object;
}): {
  meta: HeadMeta[];
  links: { rel: string; href: string }[];
  scripts?: { type: string; children: string }[];
} {
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(OG_IMAGE_PATH);
  const meta: HeadMeta[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "robots", content: input.robots ?? "index, follow" },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.ogType ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: BRAND },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: BRAND },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: BRAND },
  ];
  const links = [{ rel: "canonical", href: url }];
  if (!input.jsonLd) return { meta, links };
  return {
    meta,
    links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(input.jsonLd).replaceAll("<", "\\u003c"),
      },
    ],
  };
}

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/favicon.svg"),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND,
    url: `${SITE_URL}/`,
    inLanguage: "en",
    description: homeSummary(),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

function webAppNode(url: string, name: string, description: string) {
  return { "@type": "WebApplication", name, url, description };
}

function faqNode() {
  return {
    "@type": "FAQPage",
    mainEntity: faqEntries().map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function itemListNode(name: string, items: { name: string; url: string }[]) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function homeHead() {
  const page = homeIndexable();
  return contentHead({
    ...page,
    jsonLd: graph(
      organizationNode(),
      websiteNode(),
      webAppNode(`${SITE_URL}/`, BRAND, homeSummary()),
      faqNode(),
    ),
  });
}

export function airlinesHead() {
  const page = airlinesIndexable();
  return contentHead({
    ...page,
    jsonLd: graph(
      breadcrumbLd(trail(sections.airlines)),
      itemListNode(
        "Who lets what on board.",
        airlinesByName().map((airline) => ({
          name: airline.name,
          url: absoluteUrl(`/airlines/${airline.id}`),
        })),
      ),
    ),
  });
}

export function airlineHead(airline: Airline) {
  const page = airlineIndexable(airline);
  return contentHead({
    ...page,
    ogType: "article",
    jsonLd: graph(breadcrumbLd(trail(sections.airlines, { name: airline.name, path: page.path }))),
  });
}

export function modelsHead() {
  const page = modelsIndexable();
  return contentHead({
    ...page,
    jsonLd: graph(
      breadcrumbLd(trail(sections.models)),
      itemListNode(
        "Models with a cited safety notice.",
        modelsByDate().map((model) => ({
          name: `${model.brand} ${model.model}`,
          url: absoluteUrl(`/models/${model.id}`),
        })),
      ),
    ),
  });
}

export function modelHead(model: Model) {
  const page = modelIndexable(model);
  return contentHead({
    ...page,
    ogType: "article",
    jsonLd: graph(breadcrumbLd(trail(sections.models, { name: model.model, path: page.path }))),
  });
}

export function calculatorHead() {
  const page = calculatorIndexable();
  return contentHead({
    ...page,
    jsonLd: graph(
      breadcrumbLd(trail(sections.calculator)),
      webAppNode(absoluteUrl(page.path), "Wh calculator", calculatorLead()),
    ),
  });
}

export function methodologyHead() {
  const page = methodologyIndexable();
  return contentHead({
    ...page,
    ogType: "article",
    jsonLd: graph(breadcrumbLd(trail(sections.methodology)), {
      "@type": "HowTo",
      name: "How a check works",
      description: methodologyLead(),
      step: checkSteps.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text,
      })),
    }),
  });
}

export function sourcesHead() {
  const page = sourcesIndexable();
  return contentHead({
    ...page,
    jsonLd: graph(
      breadcrumbLd(trail(sections.sources)),
      itemListNode(
        sourcesHeading(),
        sourceSections().flatMap((section) =>
          section.entries.map((entry) => ({ name: entry.source.name, url: entry.source.url })),
        ),
      ),
    ),
  });
}

export function notFoundHead(path: string, title: string, description: string) {
  return contentHead({
    title: pageTitle(title),
    description,
    path,
    robots: "noindex, follow",
  });
}

export function noindexHeaders(): Record<string, string> {
  return { "X-Robots-Tag": "noindex, follow" };
}

/** Drop a trailing slash or an empty query string. Returns null when the URL is already clean. */
export function cleanRequestPath(pathname: string, search: string): string | null {
  let path = pathname;
  let changed = false;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "") || "/";
    changed = true;
  }
  let query = search;
  if (query === "?") {
    query = "";
    changed = true;
  }
  if (!changed) return null;
  return `${path}${query}`;
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderSitemap(): string {
  const fallback = publishedOn();
  const urls = indexableEntries()
    .map((entry) => {
      const when = entry.path === "/sources" ? sourcesUpdatedOn() : fallback;
      const lastmod = when ? `\n    <lastmod>${when}</lastmod>` : "";
      return `  <url>\n    <loc>${xmlEscape(absoluteUrl(entry.path))}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const CRAWLERS = [
  "*",
  "Googlebot",
  "Bingbot",
  "Twitterbot",
  "facebookexternalhit",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
] as const;

export function renderRobots(): string {
  const groups = CRAWLERS.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n");
  return `${groups}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function renderLlms(): string {
  const lines = [
    `# ${BRAND}`,
    "",
    `> ${homeDescription()}`,
    "",
    homeSummary(),
    "",
    REG.coverageNote,
    "CabinVolt is a dated reference check, never a flight clearance. The operating airline and crew have the final word.",
    "",
    "## Pages",
    "",
    ...indexableEntries().map(
      (entry) => `- [${entry.title}](${absoluteUrl(entry.path)}): ${entry.description}`,
    ),
    "",
  ];
  return lines.join("\n");
}
