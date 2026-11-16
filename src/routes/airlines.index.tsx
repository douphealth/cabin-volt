import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { REG, yesNo } from "@/lib/registry";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/airlines/")({
  head: () => ({ meta: [
    { title: "Airline power bank rules compared (2026) | CabinVolt" },
    { name: "description", content: "Compare power bank count, watt-hour limits and onboard use rules across 22 airlines, each with a dated official source." },
    { property: "og:title", content: "Airline power bank rules compared" },
    { property: "og:description", content: "Count, Wh limits and onboard use across 22 airlines." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Airlines,
});

type Key = "name" | "limit" | "maxWh";
function Airlines() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Key>("name");
  const [noUse, setNoUse] = useState(false);
  const rows = useMemo(() => REG.airlines
    .filter((a) => (a.name + a.iata).toLowerCase().includes(q.toLowerCase()) && (!noUse || a.use !== "no"))
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : ((a[sort] ?? 99) as number) - ((b[sort] ?? 99) as number)), [q, sort, noUse]);
  return (
    <>
      <PageHead eyebrow="Airline policies" title="Who lets what on board.">Dated records from each carrier's own pages. Strictest first when you sort by count or Wh.</PageHead>
      <section className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search airline or IATA…" className="flex-1 min-w-48 rounded-xl border bg-background/60 px-4 py-2.5 outline-none focus:border-primary" />
          {(["name", "limit", "maxWh"] as Key[]).map((k) => <button key={k} onClick={() => setSort(k)} className={`rounded-full border px-4 text-sm ${sort === k ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground"}`}>{k === "name" ? "A–Z" : k === "limit" ? "Count" : "Max Wh"}</button>)}
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={noUse} onChange={(e) => setNoUse(e.target.checked)} className="accent-primary" />Use onboard allowed</label>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((a) => (
            <Link key={a.id} to="/airlines/$id" params={{ id: a.id }} className="panel lift p-5 block">
              <div className="flex justify-between items-start"><h3 className="font-display text-lg font-semibold">{a.name}</h3><span className="font-mono text-xs border rounded px-1.5 py-0.5">{a.iata}</span></div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="rounded-lg bg-secondary/60 py-2"><div className="font-display text-2xl font-bold">{a.limit ?? "?"}</div><div className="font-mono text-[10px] text-muted-foreground">MAX</div></div>
                <div className="rounded-lg bg-secondary/60 py-2"><div className="font-display text-2xl font-bold">{a.maxWh ?? "?"}</div><div className="font-mono text-[10px] text-muted-foreground">WH</div></div>
                <div className="rounded-lg bg-secondary/60 py-2 flex flex-col justify-center"><div className={`text-xs font-semibold ${a.use === "no" ? "text-danger" : a.use === "yes" ? "text-safe" : "text-caution"}`}>{yesNo(a.use)}</div><div className="font-mono text-[10px] text-muted-foreground">USE</div></div>
              </div>
              {a.coverage !== "full" && <p className="mt-3 font-mono text-[10px] text-caution">PARTIAL COVERAGE</p>}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
