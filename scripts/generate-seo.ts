import { writeFileSync } from "node:fs";

import { renderLlms, renderRobots, renderSitemap } from "../src/lib/site.ts";

const files = {
  "../public/sitemap.xml": renderSitemap(),
  "../public/robots.txt": renderRobots(),
  "../public/llms.txt": renderLlms(),
} as const;

for (const [path, body] of Object.entries(files)) {
  writeFileSync(new URL(path, import.meta.url), body);
}

console.log(
  `Wrote ${Object.keys(files).length} SEO files for ${renderSitemap().match(/<loc>/g)?.length ?? 0} URLs.`,
);
