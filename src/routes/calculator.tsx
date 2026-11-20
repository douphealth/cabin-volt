import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { calculateWh } from "@/lib/logic";
import { PageHead } from "@/components/Shell";
import { WhGauge } from "@/components/WhGauge";
import { Faq, type QA } from "@/components/Faq";
import { AmazonPicks } from "@/components/AmazonPicks";
import { POWER_BANK_PICKS } from "@/lib/picks";
import { Link } from "@tanstack/react-router";
import { TABLE_MAH, mahFor, verdict, whFrom } from "@/lib/flying-rules";

const FAQ: QA[] = [
  { q: "How do you convert mAh to Wh?", a: "Multiply the capacity in mAh by the nominal cell voltage, then divide by 1,000. For example, 20,000 mAh × 3.7 V ÷ 1,000 = 74 Wh." },
  { q: "Which voltage should I use?", a: "Use the nominal cell voltage printed on the battery, usually 3.6 V, 3.7 V or 3.85 V. Do not use the 5 V USB output voltage, which would overstate the energy." },
  { q: "How many mAh is 100 Wh?", a: `About ${mahFor(100).toLocaleString("en")} mAh at 3.7 V, or about ${mahFor(100, 3.6).toLocaleString("en")} mAh at 3.6 V.` },
  { q: "Why do airlines use Wh instead of mAh?", a: "Watt-hours measure stored energy regardless of voltage, so one limit works for every battery type. Airline and FAA limits are 100 Wh without approval and 160 Wh with approval." },
];

export const Route = createFileRoute("/calculator")({
  head: () => ({ meta: [
    { title: "mAh to Wh converter for power banks and flights | CabinVolt" },
    { name: "description", content: "Convert mAh to Wh (watt-hours) with the formula Wh = mAh × V ÷ 1000, see a table of common power bank sizes, and check them against the 100 Wh and 160 Wh flight limits." },
    { property: "og:title", content: "mAh to Wh calculator for flights" },
    { property: "og:description", content: "See instantly if your power bank is under 100 Wh or 160 Wh." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Calc,
});

function Calc() {
  const [mah, setMah] = useState(20000);
  const [v, setV] = useState(3.7);
  const wh = calculateWh(mah, v);
  const zone = wh == null ? "" : wh > 160 ? "Above 160 Wh — not allowed as a passenger power bank." : wh > 100 ? "100–160 Wh — most airlines require approval, max two." : "Under 100 Wh — the usual cabin threshold. Airline limits still apply.";
  return (
    <>
      <PageHead eyebrow="Wh calculator" title="Drag to see where you land.">Wh = mAh × nominal cell voltage ÷ 1000. Use the cell voltage on the label (usually 3.6–3.85 V), never the 5 V USB output.</PageHead>
      <section className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-8">
        <div className="panel p-7 space-y-8">
          <div><div className="flex justify-between"><label className="font-medium">Capacity</label><span className="font-mono text-primary">{mah.toLocaleString()} mAh</span></div>
            <input type="range" min={1000} max={50000} step={500} value={mah} onChange={(e) => setMah(+e.target.value)} className="w-full mt-3 accent-primary" /></div>
          <div><div className="flex justify-between"><label className="font-medium">Cell voltage</label><span className="font-mono text-primary">{v.toFixed(2)} V</span></div>
            <input type="range" min={3.2} max={4.2} step={0.05} value={v} onChange={(e) => setV(+e.target.value)} className="w-full mt-3 accent-primary" /></div>
          <div className="flex flex-wrap gap-2">{[10000, 20000, 26800, 40000].map((p) => <button key={p} onClick={() => setMah(p)} className="font-mono text-xs border rounded-full px-3 py-1 hover:border-primary hover:text-primary transition">{p.toLocaleString()}</button>)}</div>
        </div>
        <div className="panel glow p-7 flex flex-col items-center justify-center text-center">
          <WhGauge wh={wh} />
          <p className="mt-4 max-w-sm text-muted-foreground">{zone}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">How to convert mAh to Wh</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">Watt-hours = milliamp-hours × nominal cell voltage ÷ 1,000. Most power banks use lithium-ion cells with a nominal voltage of 3.6–3.85 V; the label or manual states it. A 10,000 mAh power bank at 3.7 V holds 37 Wh.</p>
          <p className="mt-3 text-muted-foreground leading-relaxed">Airlines care about Wh because it measures stored energy. Up to 100 Wh can go in carry-on without approval; 101–160 Wh needs airline approval; above 160 Wh is not allowed as a passenger spare.</p>
          <p className="mt-3 text-sm"><Link to="/portable-charger-on-plane" className="text-primary hover:underline">Full rules for flying with a power bank →</Link> · <Link to="/100wh-power-banks" className="text-primary hover:underline">About 100 Wh power banks →</Link></p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">mAh to Wh table (3.7 V)</h2>
          <table className="mt-4 w-full text-sm">
            <thead><tr className="text-left text-muted-foreground"><th className="py-2">Capacity</th><th>Wh</th><th>Flight status</th></tr></thead>
            <tbody>{TABLE_MAH.map((m) => { const w = whFrom(m); return <tr key={m} className="border-t"><td className="py-2 font-mono">{m.toLocaleString("en")} mAh</td><td className="font-mono">{w}</td><td>{verdict(w)}</td></tr>; })}</tbody>
          </table>
        </div>
      </section>
      <Faq items={FAQ} />
      <AmazonPicks title="Power banks under the 100 Wh limit" intro="Every option below is under 100 Wh. Always confirm the Wh printed on the exact unit you buy." picks={POWER_BANK_PICKS} />
    </>
  );
}
