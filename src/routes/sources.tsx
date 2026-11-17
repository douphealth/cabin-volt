import { createFileRoute } from "@tanstack/react-router";
import { REG } from "@/lib/registry";
import { PageHead } from "@/components/Shell";
import { evidenceFor, evidenceLabel, evidenceAudit } from "@/lib/evidence";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [
    { title: "Evidence sources & verification gaps | CabinVolt" },
    { name: "description", content: "Regulator, airline, manufacturer and secondary sources with publication dates, inherited review dates and current evidence-audit status." },
    { property: "og:title", content: "CabinVolt evidence sources" }, { property: "og:description", content: "Supporting passages, source dates and unresolved verification gaps." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => {
    const groups = Object.entries(REG.sources).reduce<Record<string, [string, (typeof REG.sources)[string]][]>>((g, e) => ((g[e[1].type] ??= []).push(e), g), {});
    return (
      <>
        <PageHead eyebrow="Sources" title={`${Object.keys(REG.sources).length} cited source records.`}>Regulators, manufacturers, carriers and secondary reporting. Audit attempted {evidenceAudit.checkedAt}; a successful retrieval alone is not policy verification. Re-check applicable sources before travel.</PageHead>
        <section className="mx-auto max-w-6xl px-5 space-y-10">
          {Object.entries(groups).map(([type, list]) => (
            <div key={type}><p className="eyebrow mb-3">{type} · {list.length}</p>
              <div className="grid md:grid-cols-2 gap-3">{list.map(([k, s]) => (
                <article key={k} className="panel p-4"><a href={s.url} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">{s.name} ↗</a><div className="text-xs text-muted-foreground mt-2">Publication: {s.date ?? "not recorded"} · inherited review: {s.independentlyReviewed ?? "not recorded"}</div><p className="text-sm mt-3 text-caution">{evidenceLabel(k)}</p><p className="text-xs text-muted-foreground mt-1">{evidenceFor(k)?.note}</p>{evidenceFor(k)?.excerpt && <blockquote className="border-l-2 pl-3 mt-3 text-sm">“{evidenceFor(k)?.excerpt}”</blockquote>}{evidenceFor(k)?.applicability && <p className="text-xs text-muted-foreground mt-2">Scope: {evidenceFor(k)?.applicability}</p>}{evidenceFor(k)?.effectiveFrom && <p className="text-xs text-muted-foreground mt-2">Effective: {evidenceFor(k)?.effectiveFrom}</p>}</article>
              ))}</div></div>
          ))}
        </section>
      </>
    );
  },
});
