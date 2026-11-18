import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { REG, scopeLabel } from "@/lib/registry";
import { PageHead } from "@/components/Shell";
import { Faq, Block } from "@/components/Faq";
import { AmazonPicks } from "@/components/AmazonPicks";
import { POWER_BANK_PICKS } from "@/lib/picks";
import { modelAnswer, modelSteps, modelFaq } from "@/lib/content";

export const Route = createFileRoute("/models/$id")({
  loader: ({ params }) => { const m = REG.models.find((x) => x.id === params.id); if (!m) throw notFound(); return m; },
  head: ({ loaderData: m }) => ({ meta: m ? [
    { title: `${m.brand} ${m.model} ${m.name} — recall & flight status | CabinVolt` },
    { name: "description", content: m.description },
    { property: "og:title", content: `${m.brand} ${m.model}: can it fly?` }, { property: "og:description", content: m.description },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
  ] : [{ title: "Model not found | CabinVolt" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const m = Route.useLoaderData();
  const airlines = REG.airlines.filter((a) => a.bannedModels?.includes(m.id) || (a.banRecalled && m.issue === "recall"));
  return (
    <>
      <PageHead eyebrow={`${m.brand} · ${m.issue} · ${m.date}`} title={<span className="font-mono">{m.model}</span>}>{m.name}</PageHead>
      <section className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="panel p-7">
          <p className="text-lg leading-relaxed">{m.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-secondary/60 p-4"><div className="font-mono text-[10px] text-muted-foreground">SCOPE</div><div className="font-semibold mt-1">{scopeLabel(m.scope)}</div></div>
            <div className="rounded-xl bg-secondary/60 p-4"><div className="font-mono text-[10px] text-muted-foreground">RATING</div><div className="font-semibold mt-1">{m.wh ? `${m.wh} Wh` : "Check label"}</div></div>
            {m.serialPrefixes?.length ? <div className="rounded-xl bg-secondary/60 p-4"><div className="font-mono text-[10px] text-muted-foreground">SERIAL PREFIXES</div><div className="font-mono text-sm mt-1">{m.serialPrefixes.join(", ")}</div></div> : null}
          </div>
          {airlines.length > 0 && <><p className="eyebrow mt-8">Airlines that refuse it</p><div className="flex flex-wrap gap-2 mt-3">{airlines.map((a) => <Link key={a.id} to="/airlines/$id" params={{ id: a.id }} className="border rounded-full px-3 py-1 text-sm hover:border-primary">{a.name}</Link>)}</div></>}
        </div>
        <aside className="panel p-6 h-fit space-y-3">
          <p className="eyebrow">Official sources</p>
          {(m.sources ?? []).map((k) => REG.sources[k] && <a key={k} href={REG.sources[k].url} target="_blank" rel="noreferrer" className="block text-sm hover:text-primary">{REG.sources[k].name} ↗<span className="block font-mono text-[11px] text-muted-foreground">{REG.sources[k].type}{REG.sources[k].date ? ` · ${REG.sources[k].date}` : ""}</span></a>)}
          <Link to="/" className="inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-medium">Run a full check →</Link>
        </aside>
      </section>
      <Block title={`Is it safe to fly with the ${m.brand} ${m.model}?`}>
        <p className="text-foreground text-lg">{modelAnswer(m)}</p>
      </Block>
      <Block title={`How to check your ${m.model} and what to do`}>
        <ol className="list-decimal pl-5 space-y-2">{modelSteps(m).map((s) => <li key={s}>{s}</li>)}</ol>
        {(m as typeof m & { actionUrl?: string }).actionUrl && <p><a href={(m as typeof m & { actionUrl?: string }).actionUrl} target="_blank" rel="noreferrer" className="text-primary">{m.brand} official recall page ↗</a></p>}
      </Block>
      {(() => { const rel = REG.models.filter((x) => x.id !== m.id && x.brand === m.brand); const other = rel.length ? rel : REG.models.filter((x) => x.id !== m.id).slice(0, 6); return (
        <Block title={rel.length ? `Other ${m.brand} power bank notices` : "Other power bank recalls"}>
          <div className="overflow-x-auto"><table className="w-full text-sm border rounded-xl"><thead><tr className="text-left font-mono text-[11px] uppercase"><th className="p-3">Model</th><th className="p-3">Name</th><th className="p-3">Scope</th><th className="p-3">Date</th></tr></thead>
            <tbody>{other.map((x) => <tr key={x.id} className="border-t"><td className="p-3 font-mono"><Link to="/models/$id" params={{ id: x.id }} className="hover:text-primary">{x.brand} {x.model}</Link></td><td className="p-3">{x.name}</td><td className="p-3">{scopeLabel(x.scope)}</td><td className="p-3 font-mono">{x.date}</td></tr>)}</tbody></table></div>
          <p><Link to="/models" className="text-primary">All {REG.models.length} tracked models →</Link></p>
        </Block>); })()}
      <AmazonPicks title="Looking for a replacement power bank?" intro="If your unit is affected, these sizes all stay under the common 100 Wh cabin limit. Check any new model against recall lists too." picks={POWER_BANK_PICKS} />
      <Faq items={modelFaq(m)} />
    </>
  );
}
