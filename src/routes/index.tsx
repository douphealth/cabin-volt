import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { evaluateLookup, suggestions } from "@/lib/logic";
import { REG, reasonText, levelLabel, t, type Model } from "@/lib/registry";
import { WhGauge } from "@/components/WhGauge";
import { LevelBadge } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CabinVolt — Can this power bank fly? Instant source-backed check" },
      { name: "description", content: `Check a power bank against dated safety notices, ${REG.airlines.length} airline records and watt-hour limits. Local evaluation, explicit uncertainty, linked evidence.` },
      { property: "og:title", content: "CabinVolt — Can this power bank fly?" },
      { property: "og:description", content: "Recalls, airline limits and watt-hours in one cited check." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const field = "w-full rounded-xl border bg-background/60 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition";

function Index() {
  const [modelText, setModelText] = useState("");
  const [model, setModel] = useState<Model | null>(null);
  const [open, setOpen] = useState(false);
  const [airlineId, setAirlineId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [mah, setMah] = useState("");
  const [volts, setVolts] = useState("3.7");
  const [whInput, setWhInput] = useState("");
  const [serial, setSerial] = useState("");
  const [india, setIndia] = useState(false);
  const [adv, setAdv] = useState(false);

  const sugg = useMemo(() => (model ? [] : suggestions(modelText, REG.models)) as Model[], [modelText, model]);
  const result = useMemo(() => evaluateLookup({
    modelId: model?.id, modelText, airlineId, quantity, mah: mah || "", volts: mah ? volts : "", whInput, serial, from: india ? "IN" : "", to: "", via: "",
  }, REG), [model, modelText, airlineId, quantity, mah, volts, whInput, serial, india]);
  const touched = modelText || airlineId || mah || whInput;
  const sev = result.severity as "danger" | "caution" | "info";
  const ring = sev === "danger" ? "border-danger/60" : sev === "caution" ? "border-caution/60" : "border-safe/60";

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 md:pt-20 pb-8 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div className="animate-rise">
          <p className="eyebrow mb-5">ICAO rule live since 27 Mar 2026 · max 2 power banks</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            Can this power bank <span className="text-primary">fly?</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Check {REG.models.length} tracked models, {REG.airlines.length} airline policy records and watt-hour limits against a dated dataset. Checker inputs are evaluated on your device; this is not a live recall search.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[[REG.models.length, "tracked models"], [REG.airlines.length, "airlines"], [Object.keys(REG.sources).length, "cited sources"]].map(([n, l]) => (
              <div key={l} className="panel px-4 py-3"><div className="font-display text-3xl font-bold">{n}</div><div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">{l}</div></div>
            ))}
          </div>
        </div>

        <div className="panel glow p-6 md:p-7 animate-rise relative overflow-hidden" style={{ animationDelay: ".1s" }}>
          <div className="absolute inset-x-0 top-0 h-px overflow-hidden"><div className="h-px w-1/4 bg-primary animate-scan" /></div>
           <p className="eyebrow mb-4">Instant check</p>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium">Model number on the label</label>
              <input className={field + " mt-1.5 font-mono"} placeholder="e.g. A1263, PB2030MI" value={modelText}
                onChange={(e) => { setModelText(e.target.value); setModel(null); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
              {open && sugg.length > 0 && (
                <ul className="absolute z-20 mt-2 w-full panel p-1 shadow-2xl">
                  {sugg.map((m) => (
                    <li key={m.id}><button type="button" onMouseDown={() => { setModel(m); setModelText(m.model); setOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary flex justify-between gap-3">
                      <span><span className="font-mono">{m.model}</span> <span className="text-muted-foreground text-sm">{m.brand} {m.name}</span></span>
                      <span className="font-mono text-[10px] text-danger uppercase">{m.issue}</span></button></li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["A1263", "PB2030MI", "BPB002"].map((x) => (
                  <button key={x} type="button" onClick={() => { const m = REG.models.find((mm) => mm.model === x) ?? null; setModel(m); setModelText(x); }}
                    className="font-mono text-[11px] px-2 py-0.5 rounded-full border text-muted-foreground hover:text-primary hover:border-primary transition">{x}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[1fr_6rem] gap-3">
              <div>
                <label htmlFor="cv-airline" className="text-sm font-medium">Operating airline</label>
                <select id="cv-airline" className={field + " mt-1.5"} value={airlineId} onChange={(e) => setAirlineId(e.target.value)}>
                  <option value="">Choose airline…</option>
                  {[...REG.airlines].sort((a, b) => a.name.localeCompare(b.name)).map((a) => <option key={a.id} value={a.id}>{a.name} ({a.iata})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cv-quantity" className="text-sm font-medium">How many</label>
                <input id="cv-quantity" type="number" min={1} className={field + " mt-1.5"} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
            </div>
            <button type="button" onClick={() => setAdv(!adv)} className="text-sm text-primary hover:underline">{adv ? "− Hide" : "+ Add"} capacity, serial & route</button>
            {adv && (
              <div className="grid grid-cols-2 gap-3 animate-rise">
                <div><label className="text-xs text-muted-foreground">Wh on label</label><input className={field + " mt-1 font-mono"} value={whInput} onChange={(e) => setWhInput(e.target.value)} placeholder="e.g. 74" /></div>
                <div><label className="text-xs text-muted-foreground">Serial number</label><input className={field + " mt-1 font-mono"} value={serial} onChange={(e) => setSerial(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Capacity (mAh)</label><input className={field + " mt-1 font-mono"} value={mah} onChange={(e) => setMah(e.target.value)} placeholder="20000" /></div>
                <div><label className="text-xs text-muted-foreground">Cell voltage (V)</label><input className={field + " mt-1 font-mono"} value={volts} onChange={(e) => setVolts(e.target.value)} /></div>
                <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={india} onChange={(e) => setIndia(e.target.checked)} className="accent-primary" /> Route touches India (DGCA rules)</label>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <div className={`panel border-2 ${touched ? ring : ""} p-6 md:p-8 transition-colors`} aria-live="polite">
          <p className="text-xs text-muted-foreground mb-5">Dataset snapshot {REG.provenance.snapshotAsOf} · source verification varies by record · not flight clearance.</p>
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
            <div className="flex flex-col items-center">
              <WhGauge wh={result.wh} />
              <span className="font-mono text-[11px] text-muted-foreground uppercase">{result.whOrigin === "unknown" ? "rating unverified" : `${result.whOrigin} rating`}</span>
            </div>
            <div>
              {touched ? (
                <>
                  <div className="flex items-center gap-3"><LevelBadge level={sev} /><span className="font-mono text-xs text-muted-foreground">verdict</span></div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">{levelLabel[sev]}</h2>
                  <p className="mt-2 text-muted-foreground max-w-2xl">{reasonText(result.code)}</p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {[["Recall status", result.recall], ["Flight rules", result.flight]].map(([l, b]) => {
                      const bb = b as { level: "danger" | "caution" | "info"; code: string };
                      return <div key={l as string} className="rounded-xl bg-secondary/60 p-4"><div className="flex justify-between items-center"><span className="text-sm font-medium">{l as string}</span><LevelBadge level={bb.level} /></div><p className="text-sm text-muted-foreground mt-2">{reasonText(bb.code)}</p></div>;
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="eyebrow">Waiting for input</p>
                  <h2 className="font-display text-3xl font-bold mt-2">Type a model or pick an airline.</h2>
                  <p className="mt-2 text-muted-foreground">The verdict updates as you type. An unmatched model is never treated as cleared.</p>
                </>
              )}
            </div>
          </div>
          {touched && (
            <details className="mt-6 border-t pt-5 group">
              <summary className="cursor-pointer text-sm font-medium text-primary">All {result.reasons.length} findings & sources</summary>
              <ul className="mt-4 space-y-2">
                {result.reasons.map((r: { level: "danger" | "caution" | "info"; code: string }, i: number) => (
                  <li key={i} className="flex gap-3 text-sm"><LevelBadge level={r.level} /><span className="text-muted-foreground">{reasonText(r.code)}</span></li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.sourceKeys.map((k: string) => REG.sources[k] && (
                  <a key={k} href={REG.sources[k].url} target="_blank" rel="noreferrer" className="text-xs rounded-full border px-3 py-1 hover:border-primary hover:text-primary transition">{REG.sources[k].name} ↗</a>
                ))}
              </div>
            </details>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 mt-20 grid md:grid-cols-3 gap-4">
        {[["quick_a_title", "quick_a_body"], ["quick_b_title", "quick_b_body"], ["quick_c_title", "quick_c_body"]].map(([a, b]: string[], i) => (
          <div key={a} className="panel lift p-6"><div className="font-mono text-primary text-sm">0{i + 1}</div><h3 className="font-display text-xl font-semibold mt-2">{t(a ?? "")}</h3><p className="text-muted-foreground mt-2 text-sm">{t(b ?? "")}</p></div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 mt-20 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="eyebrow mb-3">Latest notices</p>
          <h2 className="font-display text-3xl font-bold">What changed recently</h2>
          <ol className="mt-6 border-l ml-2">
            {REG.updates.map((u) => (
              <li key={u.date + u.title} className="pl-6 pb-6 relative"><span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary" />
                <div className="font-mono text-xs text-muted-foreground">{u.date}</div>
                {u.model ? <Link to="/models/$id" params={{ id: u.model }} className="font-semibold hover:text-primary">{u.title}</Link> : <span className="font-semibold">{u.title}</span>}
                <p className="text-sm text-muted-foreground">{u.description}</p></li>
            ))}
          </ol>
        </div>
        <div>
          <p className="eyebrow mb-3">{t("faq_eyebrow")}</p>
          <h2 className="font-display text-3xl font-bold">{t("faq_title")}</h2>
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <details key={n} className="panel p-5 group">
                <summary className="cursor-pointer font-medium flex justify-between list-none">{t(`faq${n}_q`)}<span className="text-primary transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm text-muted-foreground">{t(`faq${n}_a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
