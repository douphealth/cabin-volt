import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { REG, scopeLabel } from "@/lib/registry";
import { modelHead, noindexHeaders, notFoundHead, sections, trail } from "@/lib/site";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/models/$id")({
  loader: ({ params }) => {
    const m = REG.models.find((x) => x.id === params.id);
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData: m, params }) =>
    m
      ? modelHead(m)
      : notFoundHead(
          `/models/${params.id}`,
          "Model not found",
          "That model is not in the CabinVolt records.",
        ),
  headers: ({ loaderData }) => (loaderData ? undefined : noindexHeaders()),
  component: Page,
});

function Page() {
  const m = Route.useLoaderData();
  const airlines = REG.airlines.filter(
    (a) => a.bannedModels?.includes(m.id) || (a.banRecalled && m.issue === "recall"),
  );
  return (
    <>
      <PageHead
        eyebrow={`${m.brand} · ${m.issue} · ${m.date}`}
        title={<span className="font-mono">{m.model}</span>}
        crumbs={trail(sections.models, { name: m.model, path: `/models/${m.id}` })}
      >
        {m.name}. {m.description}
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="panel p-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary/60 p-4">
              <div className="font-mono text-[10px] text-muted-foreground">SCOPE</div>
              <div className="font-semibold mt-1">{scopeLabel(m.scope)}</div>
            </div>
            <div className="rounded-xl bg-secondary/60 p-4">
              <div className="font-mono text-[10px] text-muted-foreground">RATING</div>
              <div className="font-semibold mt-1">{m.wh ? `${m.wh} Wh` : "Check label"}</div>
            </div>
            {m.serialPrefixes?.length ? (
              <div className="rounded-xl bg-secondary/60 p-4">
                <div className="font-mono text-[10px] text-muted-foreground">SERIAL PREFIXES</div>
                <div className="font-mono text-sm mt-1">{m.serialPrefixes.join(", ")}</div>
              </div>
            ) : null}
          </div>
          {airlines.length > 0 && (
            <>
              <h2 className="eyebrow mt-8">Airlines that refuse it</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {airlines.map((a) => (
                  <Link
                    key={a.id}
                    to="/airlines/$id"
                    params={{ id: a.id }}
                    className="border rounded-full px-3 py-1 text-sm hover:border-primary"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <aside className="panel p-6 h-fit space-y-3">
          <h2 className="eyebrow">Official sources</h2>
          {(m.sources ?? []).map(
            (k) =>
              REG.sources[k] && (
                <a
                  key={k}
                  href={REG.sources[k].url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm hover:text-primary"
                >
                  {REG.sources[k].name} ↗
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {REG.sources[k].type}
                    {REG.sources[k].date ? ` · ${REG.sources[k].date}` : ""}
                  </span>
                </a>
              ),
          )}
          <Link
            to="/"
            className="inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-medium"
          >
            Run a full check →
          </Link>
        </aside>
      </section>
    </>
  );
}
