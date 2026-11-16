import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { REG, scopeLabel } from "@/lib/registry";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/models/")({
  head: () => ({ meta: [
    { title: "Power bank recalls & bans tracked for flights | CabinVolt" },
    { name: "description", content: "Curated, source-reviewed list of recalled and banned power bank models from Anker, Belkin, Xiaomi and more, with serial and batch scope." },
    { property: "og:title", content: "Recalled power banks you shouldn't fly with" },
    { property: "og:description", content: "Every tracked model with its regulator notice and scope." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Models,
});

function Models() {
  const brands = [...new Set(REG.models.map((m) => m.brand))].sort();
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");
  const list = useMemo(() => REG.models.filter((m) => (!brand || m.brand === brand) && (m.brand + m.model + m.name).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date)), [brand, q]);
  return (
    <>
      <PageHead eyebrow="Recalls & bans" title="Models with an official notice.">A curated selection, not a worldwide database. Not finding your model does not mean it's safe.</PageHead>
      <section className="mx-auto max-w-6xl px-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search model or name…" className="w-full rounded-xl border bg-background/60 px-4 py-2.5 outline-none focus:border-primary font-mono" />
        <div className="flex flex-wrap gap-2 my-4">
          {["", ...brands].map((b) => <button key={b || "all"} onClick={() => setBrand(b)} className={`rounded-full border px-3 py-1 text-sm ${brand === b ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-foreground"}`}>{b || "All brands"}</button>)}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((m) => (
            <Link key={m.id} to="/models/$id" params={{ id: m.id }} className="panel lift p-5 block">
              <div className="flex justify-between gap-3"><div><div className="font-mono text-xl font-semibold">{m.model}</div><div className="text-sm text-muted-foreground">{m.brand} · {m.name}</div></div>
                <div className="text-right"><span className={`font-mono text-[10px] uppercase rounded-full px-2 py-0.5 ${m.issue === "recall" ? "bg-danger/15 text-danger" : "bg-caution/15 text-caution"}`}>{m.issue}</span><div className="font-mono text-xs text-muted-foreground mt-2">{m.date}</div></div></div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{m.description}</p>
              <p className="font-mono text-[11px] text-primary mt-3">{scopeLabel(m.scope)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
