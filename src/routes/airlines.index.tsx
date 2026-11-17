import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { yesNo, hasDocumentedOnboardUse } from "@/lib/registry";
import { airlinesByName, airlinesHead, airlinesLead, sections, trail } from "@/lib/site";
import { PageHead, Related } from "@/components/Shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/airlines/")({
  head: () => airlinesHead(),
  component: Airlines,
});

type Key = "name" | "limit" | "maxWh";
function Airlines() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Key>("name");
  const [noUse, setNoUse] = useState(false);
  const rows = useMemo(() => {
    const filtered = airlinesByName().filter(
      (a) =>
        (a.name + a.iata).toLowerCase().includes(q.toLowerCase()) &&
        (!noUse || hasDocumentedOnboardUse(a)),
    );
    if (sort === "name") return filtered;
    return [...filtered].sort(
      (a, b) =>
        ((a[sort] ?? 99) as number) - ((b[sort] ?? 99) as number) || a.name.localeCompare(b.name),
    );
  }, [q, sort, noUse]);
  return (
    <>
      <PageHead
        eyebrow="Airline policies"
        title="Who lets what on board."
        crumbs={trail(sections.airlines)}
      >
        {airlinesLead()}
        <Related
          links={[
            { to: "/methodology", label: "How records are checked" },
            { to: "/sources", label: "Cited sources" },
          ]}
        />
      </PageHead>
      <section className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            aria-label="Search airline or IATA"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search airline or IATA…"
            className="flex-1 min-w-48 rounded-xl border bg-background/60 px-4 py-2.5 outline-none focus:border-primary"
          />
          {(["name", "limit", "maxWh"] as Key[]).map((k) => (
            <Button
              key={k}
              variant={sort === k ? "default" : "outline"}
              aria-pressed={sort === k}
              onClick={() => setSort(k)}
            >
              {k === "name" ? "A–Z" : k === "limit" ? "Count" : "Max Wh"}
            </Button>
          ))}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={noUse}
              onChange={(e) => setNoUse(e.target.checked)}
              className="accent-primary"
            />
            Documented onboard use (conditions apply)
          </label>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((a) => (
            <Link
              key={a.id}
              to="/airlines/$id"
              params={{ id: a.id }}
              className="panel lift p-5 block"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-display text-lg font-semibold">{a.name}</h2>
                <span className="font-mono text-xs border rounded px-1.5 py-0.5">{a.iata}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="rounded-lg bg-secondary/60 py-2">
                  <div className="font-display text-2xl font-bold">{a.limit ?? "?"}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">MAX</div>
                </div>
                <div className="rounded-lg bg-secondary/60 py-2">
                  <div className="font-display text-2xl font-bold">{a.maxWh ?? "?"}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">WH</div>
                </div>
                <div className="rounded-lg bg-secondary/60 py-2 flex flex-col justify-center">
                  <div
                    className={`text-xs font-semibold ${a.use === "no" ? "text-danger" : a.use === "yes" ? "text-safe" : "text-caution"}`}
                  >
                    {yesNo(a.use)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">USE</div>
                </div>
              </div>
              {a.coverage !== "full" && (
                <p className="mt-3 font-mono text-[10px] text-caution">PARTIAL COVERAGE</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
