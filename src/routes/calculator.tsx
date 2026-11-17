import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { calculateWh } from "@/lib/logic";
import { calculatorHead, calculatorLead, sections, trail } from "@/lib/site";
import { PageHead, Related } from "@/components/Shell";
import { WhGauge } from "@/components/WhGauge";

export const Route = createFileRoute("/calculator")({
  head: () => calculatorHead(),
  component: Calc,
});

function Calc() {
  const [mah, setMah] = useState(20000);
  const [v, setV] = useState(3.7);
  const wh = calculateWh(mah, v);
  const zone =
    wh == null
      ? ""
      : wh > 160
        ? "Above 160 Wh — not allowed as a passenger power bank."
        : wh > 100
          ? "100–160 Wh — most airlines require approval, max two."
          : "Under 100 Wh — the usual cabin threshold. Airline limits still apply.";
  return (
    <>
      <PageHead
        eyebrow="Wh calculator"
        title="Drag to see where you land."
        crumbs={trail(sections.calculator)}
      >
        {calculatorLead()}
        <Related
          links={[
            { to: "/", label: "Check a power bank" },
            { to: "/airlines", label: "Airline limits" },
          ]}
        />
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-8">
        <div className="panel p-7 space-y-8">
          <div>
            <div className="flex justify-between">
              <label className="font-medium">Capacity</label>
              <span className="font-mono text-primary">{mah.toLocaleString()} mAh</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={mah}
              onChange={(e) => setMah(+e.target.value)}
              className="w-full mt-3 accent-primary"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <label className="font-medium">Cell voltage</label>
              <span className="font-mono text-primary">{v.toFixed(2)} V</span>
            </div>
            <input
              type="range"
              min={3.2}
              max={4.2}
              step={0.05}
              value={v}
              onChange={(e) => setV(+e.target.value)}
              className="w-full mt-3 accent-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[10000, 20000, 26800, 40000].map((p) => (
              <button
                key={p}
                onClick={() => setMah(p)}
                className="font-mono text-xs border rounded-full px-3 py-1 hover:border-primary hover:text-primary transition"
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <div className="panel glow p-7 flex flex-col items-center justify-center text-center">
          <WhGauge wh={wh} />
          <p className="mt-4 max-w-sm text-muted-foreground">{zone}</p>
        </div>
      </section>
    </>
  );
}
