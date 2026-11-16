import { createFileRoute } from "@tanstack/react-router";
import { REG } from "@/lib/registry";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/methodology")({
  head: () => ({ meta: [
    { title: "Methodology — how CabinVolt verifies power bank rules" },
    { name: "description", content: "Authority order, review dates, limitations and the safety-first logic behind every CabinVolt verdict." },
    { property: "og:title", content: "How CabinVolt verifies" }, { property: "og:description", content: "Regulator first, airline second, manufacturer third. No optimistic claims." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => (
    <>
      <PageHead eyebrow="Methodology" title="Safety first. No optimistic claims.">Every verdict comes from the strictest applicable finding. Uncertainty is shown as "verify", never as "OK".</PageHead>
      <section className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-6">
        <div className="panel p-7"><p className="eyebrow mb-4">Authority order</p>
          <ol className="space-y-3">{REG.provenance.authorityOrder.map((a, i) => <li key={a} className="flex items-center gap-4"><span className="font-display text-3xl font-bold text-primary w-8">{i + 1}</span><span className="capitalize text-lg">{a}</span></li>)}</ol></div>
        <div className="panel p-7"><p className="eyebrow mb-4">Known limitations</p>
          <ul className="space-y-2 text-muted-foreground">{REG.provenance.limitations.map((l) => <li key={l}>— {l}</li>)}</ul>
          <p className="font-mono text-xs mt-6">Last manual review {REG.provenance.lastManualReview}</p></div>
        <div className="panel p-7 md:col-span-2"><p className="eyebrow mb-4">How a check works</p>
          <div className="grid sm:grid-cols-4 gap-4 text-sm">{["Match the exact model number against curated notices.", "Apply serial, batch, seller or route conditions.", "Compare watt-hours and count to ICAO and the airline.", "Return the strictest finding, with every source linked."].map((s, i) => <div key={i}><div className="font-mono text-primary">STEP 0{i + 1}</div><p className="mt-1 text-muted-foreground">{s}</p></div>)}</div></div>
      </section>
    </>
  ),
});
