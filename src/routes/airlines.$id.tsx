import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { REG, yesNo } from "@/lib/registry";
import { airlineHead, noindexHeaders, notFoundHead, sections, trail } from "@/lib/site";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/airlines/$id")({
  loader: ({ params }) => {
    const a = REG.airlines.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData: a, params }) =>
    a
      ? airlineHead(a)
      : notFoundHead(
          `/airlines/${params.id}`,
          "Airline not found",
          "That airline is not in the CabinVolt records.",
        ),
  headers: ({ loaderData }) => (loaderData ? undefined : noindexHeaders()),
  component: Page,
});

function Page() {
  const a = Route.useLoaderData();
  const src = REG.sources[a.source];
  const banned = REG.models.filter((m) => a.bannedModels?.includes(m.id));
  const facts = [
    ["Power banks allowed", a.limit ?? "Unverified"],
    ["Max per bank", a.maxWh ? `${a.maxExclusive ? "<" : "≤"} ${a.maxWh} Wh` : "Unverified"],
    ["Over 100 Wh", yesNo(a.large)],
    ["Charge devices onboard", yesNo(a.use)],
    ["Recharge the bank onboard", yesNo(a.recharge)],
    ["Recalled units", a.banRecalled ? "Banned" : "Not stated"],
  ];
  return (
    <>
      <PageHead
        eyebrow={`${a.iata} · ${a.coverage} coverage`}
        title={a.name}
        crumbs={trail(sections.airlines, { name: a.name, path: `/airlines/${a.id}` })}
      >
        {a.note}
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {facts.map(([k, v]) => (
            <div key={k as string} className="panel p-5">
              <div className="font-mono text-[11px] uppercase text-muted-foreground">{k}</div>
              <div className="font-display text-2xl font-semibold mt-1">{v}</div>
            </div>
          ))}
        </div>
        <aside className="panel p-6 h-fit">
          <h2 className="eyebrow">Source</h2>
          {src && (
            <a
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="block mt-2 font-medium hover:text-primary"
            >
              {src.name} ↗
            </a>
          )}
          {src?.independentlyReviewed && (
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Reviewed {src.independentlyReviewed}
            </p>
          )}
          {banned.length > 0 && (
            <>
              <h2 className="eyebrow mt-6">Named banned models</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {banned.map((m) => (
                  <Link
                    key={m.id}
                    to="/models/$id"
                    params={{ id: m.id }}
                    className="font-mono text-xs border rounded-full px-2.5 py-1 hover:border-danger"
                  >
                    {m.model}
                  </Link>
                ))}
              </div>
            </>
          )}
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-medium"
          >
            Check my power bank →
          </Link>
        </aside>
      </section>
    </>
  );
}
