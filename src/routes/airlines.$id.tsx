import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { REG, yesNo } from "@/lib/registry";
import { PageHead } from "@/components/Shell";
import { Faq, Block } from "@/components/Faq";
import { airlineAnswer, airlineFaq, airlineStats, peers, CAPACITIES, mahToWh, whVerdict, verdictClass, verified } from "@/lib/content";

export const Route = createFileRoute("/airlines/$id")({
  loader: ({ params }) => { const a = REG.airlines.find((x) => x.id === params.id); if (!a) throw notFound(); return a; },
  head: ({ loaderData: a }) => ({ meta: a ? [
    { title: `${a.name} power bank rules 2026 | CabinVolt` },
    { name: "description", content: `${a.name} power bank rules: ${a.note}`.slice(0, 158) },
    { property: "og:title", content: `${a.name} power bank rules` }, { property: "og:description", content: a.note },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
  ] : [{ title: "Airline not found | CabinVolt" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const a = Route.useLoaderData();
  const src = REG.sources[a.source];
  const banned = REG.models.filter((m) => a.bannedModels?.includes(m.id));
  const facts = [["Power banks allowed", a.limit ?? "Unverified"], ["Max per bank", a.maxWh ? `${a.maxExclusive ? "<" : "≤"} ${a.maxWh} Wh` : "Unverified"], ["Over 100 Wh", yesNo(a.large)], ["Charge devices onboard", yesNo(a.use)], ["Recharge the bank onboard", yesNo(a.recharge)], ["Recalled units", a.banRecalled ? "Banned" : "Not stated"]];
  return (
    <>
      <PageHead eyebrow={`${a.iata} · ${a.coverage} coverage`} title={a.name}>{a.note}</PageHead>
      <section className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {facts.map(([k, v]) => <div key={k as string} className="panel p-5"><div className="font-mono text-[11px] uppercase text-muted-foreground">{k}</div><div className="font-display text-2xl font-semibold mt-1">{v}</div></div>)}
        </div>
        <aside className="panel p-6 h-fit">
          <p className="eyebrow">Source</p>
          {src && <a href={src.url} target="_blank" rel="noreferrer" className="block mt-2 font-medium hover:text-primary">{src.name} ↗</a>}
          {src?.independentlyReviewed && <p className="font-mono text-xs text-muted-foreground mt-2">Reviewed {src.independentlyReviewed}</p>}
          {banned.length > 0 && <><p className="eyebrow mt-6">Named banned models</p><div className="flex flex-wrap gap-2 mt-2">{banned.map((m) => <Link key={m.id} to="/models/$id" params={{ id: m.id }} className="font-mono text-xs border rounded-full px-2.5 py-1 hover:border-danger">{m.model}</Link>)}</div></>}
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-medium">Check my power bank →</Link>
        </aside>
      </section>
      <Block title={`Can I bring a power bank on ${a.short}?`}>
        <p className="text-foreground text-lg">{airlineAnswer(a)}</p>
        {verified(a) && (() => { const s = airlineStats(a); return <p>Among the {s.total} airlines with verified limits in CabinVolt, {s.oneBank} cap passengers at one power bank{s.isOneBank ? ` (${a.short} is one of them)` : ""}, {s.noUse} ban in-flight use, and {s.approval} accept 100–160 Wh units with approval.</p>; })()}
      </Block>
      <Block title={`Which power bank sizes are allowed on ${a.short}?`}>
        <p>Watt-hours (Wh) decide what flies, not mAh. Convert with mAh × {"3.7"} V ÷ 1000, or read the Wh value printed on the label, which always takes precedence.</p>
        <div className="overflow-x-auto"><table className="w-full text-sm border rounded-xl"><thead><tr className="text-left font-mono text-[11px] uppercase"><th className="p-3">Capacity</th><th className="p-3">≈ Wh</th><th className="p-3">On {a.short}</th></tr></thead>
          <tbody>{CAPACITIES.map((c) => { const wh = mahToWh(c); const v = whVerdict(a, wh); return <tr key={c} className="border-t"><td className="p-3">{c.toLocaleString("en")} mAh</td><td className="p-3 font-mono">{wh}</td><td className={`p-3 font-medium ${verdictClass(v)}`}>{v}</td></tr>; })}</tbody></table></div>
      </Block>
      <Block title={`How ${a.short} compares with other airlines`}>
        <div className="overflow-x-auto"><table className="w-full text-sm border rounded-xl"><thead><tr className="text-left font-mono text-[11px] uppercase"><th className="p-3">Airline</th><th className="p-3">Banks</th><th className="p-3">Max Wh</th><th className="p-3">100–160 Wh</th><th className="p-3">In-flight use</th></tr></thead>
          <tbody>{[a, ...peers(a)].map((x) => <tr key={x.id} className={`border-t ${x.id === a.id ? "bg-secondary/50" : ""}`}><td className="p-3">{x.id === a.id ? <strong>{x.name}</strong> : <Link to="/airlines/$id" params={{ id: x.id }} className="hover:text-primary underline-offset-2 hover:underline">{x.name}</Link>}</td><td className="p-3">{x.limit ?? "?"}</td><td className="p-3 font-mono">{x.maxWh ? `${x.maxExclusive ? "<" : "≤"}${x.maxWh}` : "?"}</td><td className="p-3">{yesNo(x.large)}</td><td className="p-3">{yesNo(x.use)}</td></tr>)}</tbody></table></div>
        <p><Link to="/airlines" className="text-primary">See all {REG.airlines.length} airlines →</Link></p>
      </Block>
      <Block title="Before you fly: a 4-step check">
        <ol className="list-decimal pl-5 space-y-2"><li>Find the Wh rating on the power bank label (or convert from mAh).</li><li>Confirm it is within {a.short}'s limit and you are within the per-passenger count.</li><li>Check the model is not on a recall list with the <Link to="/" className="text-primary">CabinVolt checker</Link>.</li><li>Pack it in your carry-on, terminals covered, never in checked baggage.</li></ol>
      </Block>
      <Faq items={airlineFaq(a)} />
    </>
  );
}
