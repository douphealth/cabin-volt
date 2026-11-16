import { createFileRoute } from "@tanstack/react-router";
import { REG } from "@/lib/registry";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [
    { title: "All official sources — regulators, airlines, manufacturers | CabinVolt" },
    { name: "description", content: "Every regulator notice, airline policy and manufacturer recall page CabinVolt relies on, with review dates." },
    { property: "og:title", content: "CabinVolt sources" }, { property: "og:description", content: "Every official page behind our verdicts." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => {
    const groups = Object.entries(REG.sources).reduce<Record<string, [string, (typeof REG.sources)[string]][]>>((g, e) => ((g[e[1].type] ??= []).push(e), g), {});
    return (
      <>
        <PageHead eyebrow="Sources" title={`${Object.keys(REG.sources).length} official pages, all dated.`}>Snapshot, not live monitoring. Always re-check the airline before you fly.</PageHead>
        <section className="mx-auto max-w-6xl px-5 space-y-10">
          {Object.entries(groups).map(([type, list]) => (
            <div key={type}><p className="eyebrow mb-3">{type} · {list.length}</p>
              <div className="grid md:grid-cols-2 gap-3">{list.map(([k, s]) => (
                <a key={k} href={s.url} target="_blank" rel="noreferrer" className="panel lift p-4 block"><div className="font-medium">{s.name} ↗</div><div className="font-mono text-[11px] text-muted-foreground mt-1">{s.date ? `Published ${s.date} · ` : ""}Reviewed {s.independentlyReviewed ?? "—"}</div></a>
              ))}</div></div>
          ))}
        </section>
      </>
    );
  },
});
