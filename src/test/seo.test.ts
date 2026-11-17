import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { REG } from "@/lib/registry";
import {
  SITE_URL,
  absoluteUrl,
  airlineHead,
  airlinesByName,
  calculatorHead,
  checkSteps,
  cleanRequestPath,
  clip,
  contentHead,
  faqEntries,
  homeHead,
  indexableEntries,
  methodologyHead,
  modelsByDate,
  pageTitle,
  publishedOn,
  renderLlms,
  renderRobots,
  renderSitemap,
  sourcesUpdatedOn,
} from "@/lib/site";

function jsonLdText(head: { scripts?: { children: string }[] }): string {
  const raw = head.scripts?.[0]?.children ?? "";
  const parsed = JSON.parse(raw.replaceAll("\\u003c", "<")) as unknown;
  return JSON.stringify(parsed);
}

describe("SEO metadata", () => {
  it("uses the production origin unless VITE_SITE_URL overrides it", () => {
    expect(SITE_URL).toBe("https://cabinvolt.shop");
    expect(absoluteUrl("/")).toBe("https://cabinvolt.shop/");
    expect(absoluteUrl("/airlines")).toBe("https://cabinvolt.shop/airlines");
  });

  it("lists every content URL once, with titles and descriptions inside the limits", () => {
    const entries = indexableEntries();
    const paths = entries.map((entry) => entry.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.filter((path) => path === "/")).toHaveLength(1);
    for (const airline of REG.airlines) expect(paths).toContain(`/airlines/${airline.id}`);
    for (const model of REG.models) expect(paths).toContain(`/models/${model.id}`);
    expect(entries).toHaveLength(6 + REG.airlines.length + REG.models.length);

    const titles = entries.map((entry) => entry.title);
    const descriptions = entries.map((entry) => entry.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const entry of entries) {
      expect(entry.title.length).toBeLessThanOrEqual(60);
      expect(entry.description.length).toBeLessThanOrEqual(160);
      expect(entry.description.length).toBeGreaterThan(40);
      expect(entry.path).not.toContain("?");
      expect(entry.title).not.toMatch(/lovable/i);
    }
  });

  it("keeps a long title inside 60 characters", () => {
    expect(pageTitle("x".repeat(200)).length).toBeLessThanOrEqual(60);
    expect(clip("word ".repeat(80), 160).length).toBeLessThanOrEqual(160);
  });

  it("puts a self-referencing canonical and indexable robots meta on content pages", () => {
    const head = homeHead();
    expect(head.links).toEqual([{ rel: "canonical", href: "https://cabinvolt.shop/" }]);
    expect(head.meta).toContainEqual({ name: "robots", content: "index, follow" });
    expect(head.meta).toContainEqual({ property: "og:url", content: "https://cabinvolt.shop/" });
    expect(head.meta).toContainEqual({
      property: "og:image",
      content: "https://cabinvolt.shop/og.png",
    });
    expect(JSON.stringify(head.links)).not.toContain("hreflang");
    expect(head.meta.some((item) => "name" in item && item.name === "author")).toBe(false);
  });

  it("matches visible FAQ, HowTo, and breadcrumb copy", () => {
    const home = jsonLdText(homeHead());
    expect(home).toContain("Organization");
    expect(home).toContain("WebSite");
    expect(home).toContain("WebApplication");
    expect(home).toContain("FAQPage");
    for (const item of faqEntries()) {
      expect(home).toContain(item.q);
      expect(home).toContain(item.a);
    }

    const method = jsonLdText(methodologyHead());
    expect(method).toContain("HowTo");
    for (const step of checkSteps) expect(method).toContain(step);

    const emirates = airlinesByName().find((airline) => airline.id === "emirates");
    expect(emirates).toBeTruthy();
    if (!emirates) return;
    const airline = jsonLdText(airlineHead(emirates));
    expect(airline).toContain("BreadcrumbList");
    expect(airline).toContain("Emirates");
    expect(airline).toContain("https://cabinvolt.shop/airlines/emirates");

    const calculator = jsonLdText(calculatorHead());
    expect(calculator).toContain("WebApplication");
    expect(calculator).toContain("Wh calculator");
  });

  it("renders sitemap, robots, and llms from the same URL list", () => {
    const xml = renderSitemap();
    const entries = indexableEntries();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.match(/<loc>/g)).toHaveLength(entries.length);
    for (const entry of entries) {
      const loc = `<loc>${absoluteUrl(entry.path)}</loc>`;
      expect(xml.split(loc).length - 1).toBe(1);
    }
    const published = publishedOn();
    expect(published).toBe("2026-11-01");
    expect(xml).toContain(`<lastmod>${published}</lastmod>`);
    expect(xml).toContain(`<lastmod>${sourcesUpdatedOn()}</lastmod>`);
    expect(readFileSync("public/sitemap.xml", "utf8")).toBe(xml);

    const robots = renderRobots();
    for (const agent of [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "PerplexityBot",
      "ClaudeBot",
      "Google-Extended",
      "Applebot-Extended",
      "Bingbot",
    ]) {
      expect(robots).toContain(`User-agent: ${agent}\nAllow: /`);
    }
    expect(robots).toContain("Sitemap: https://cabinvolt.shop/sitemap.xml");
    expect(robots).not.toContain("Disallow");
    expect(readFileSync("public/robots.txt", "utf8")).toBe(robots);

    const llms = renderLlms();
    expect(llms.startsWith("# CabinVolt")).toBe(true);
    expect(llms).toContain("https://cabinvolt.shop/airlines");
    expect(llms).toContain("never a flight clearance");
    expect(modelsByDate().length).toBe(REG.models.length);
    expect(readFileSync("public/llms.txt", "utf8")).toBe(llms);
  });

  it("publishes one IndexNow key file whose body is the key", () => {
    const keys = readdirSync("public").filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
    expect(keys).toEqual(["0dbdc27baf59eb4f9afe81d114e8300a.txt"]);
    expect(readFileSync(`public/${keys[0]}`, "utf8").trim()).toBe(
      "0dbdc27baf59eb4f9afe81d114e8300a",
    );
  });

  it("cleans trailing slashes and empty queries without dropping real parameters", () => {
    expect(cleanRequestPath("/airlines/", "")).toBe("/airlines");
    expect(cleanRequestPath("/airlines", "")).toBeNull();
    expect(cleanRequestPath("/", "")).toBeNull();
    expect(cleanRequestPath("/", "?")).toBe("/");
    expect(cleanRequestPath("/airlines/", "?q=1")).toBe("/airlines?q=1");
    expect(cleanRequestPath("/models", "?q=1")).toBeNull();
  });

  it("noindexes utility responses", () => {
    const missing = contentHead({
      title: "Page not found | CabinVolt",
      description: "That address is not a CabinVolt page.",
      path: "/missing",
      robots: "noindex, follow",
    });
    expect(missing.meta).toContainEqual({ name: "robots", content: "noindex, follow" });
  });
});
