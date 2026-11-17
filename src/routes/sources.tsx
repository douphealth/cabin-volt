import { createFileRoute } from "@tanstack/react-router";
import { PageHead, Related } from "@/components/Shell";
import { evidenceFor, evidenceLabel } from "@/lib/evidence";
import {
  sections,
  sourceSections,
  sourcesHead,
  sourcesHeading,
  sourcesLead,
  trail,
} from "@/lib/site";

export const Route = createFileRoute("/sources")({
  head: () => sourcesHead(),
  component: () => (
    <>
      <PageHead eyebrow="Sources" title={sourcesHeading()} crumbs={trail(sections.sources)}>
        {sourcesLead()}
        <Related links={[{ to: "/methodology", label: "How verification works" }]} />
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 space-y-10">
        {sourceSections().map((section) => (
          <div key={section.type}>
            <h2 className="eyebrow mb-3">
              {section.type} · {section.entries.length}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {section.entries.map(({ key, source }) => (
                <article key={key} className="panel p-4">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium hover:text-primary"
                  >
                    {source.name} ↗
                  </a>
                  <div className="text-xs text-muted-foreground mt-2">
                    Publication: {source.date ?? "not recorded"} · inherited review:{" "}
                    {source.independentlyReviewed ?? "not recorded"}
                  </div>
                  <p className="text-sm mt-3 text-caution">{evidenceLabel(key)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{evidenceFor(key)?.note}</p>
                  {evidenceFor(key)?.excerpt && (
                    <blockquote className="border-l-2 pl-3 mt-3 text-sm">
                      “{evidenceFor(key)?.excerpt}”
                    </blockquote>
                  )}
                  {evidenceFor(key)?.applicability && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Scope: {evidenceFor(key)?.applicability}
                    </p>
                  )}
                  {evidenceFor(key)?.effectiveFrom && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Effective: {evidenceFor(key)?.effectiveFrom}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  ),
});
