import { createFileRoute } from "@tanstack/react-router";
import { REG } from "@/lib/registry";
import { checkSteps, methodologyHead, methodologyLead, sections, trail } from "@/lib/site";
import { PageHead, Related } from "@/components/Shell";

export const Route = createFileRoute("/methodology")({
  head: () => methodologyHead(),
  component: () => (
    <>
      <PageHead
        eyebrow="Methodology"
        title="Safety first. No optimistic claims."
        crumbs={trail(sections.methodology)}
      >
        {methodologyLead()}
        <Related links={[{ to: "/sources", label: "Evidence sources" }]} />
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid md:grid-cols-2 gap-6">
        <div className="panel p-7">
          <p className="eyebrow mb-4">Authority order</p>
          <ol className="space-y-3">
            {REG.provenance.authorityOrder.map((a, i) => (
              <li key={a} className="flex items-center gap-4">
                <span className="font-display text-3xl font-bold text-primary w-8">{i + 1}</span>
                <span className="capitalize text-lg">{a}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel p-7">
          <p className="eyebrow mb-4">Known limitations</p>
          <ul className="space-y-2 text-muted-foreground">
            {REG.provenance.limitations.map((l) => (
              <li key={l}>— {l}</li>
            ))}
          </ul>
          <p className="font-mono text-xs mt-6">
            Inherited dataset review {REG.provenance.lastManualReview}; not a fresh verification of
            every rule.
          </p>
        </div>
        <div className="panel p-7 md:col-span-2">
          <p className="eyebrow mb-4">How a check works</p>
          <div className="grid sm:grid-cols-4 gap-4 text-sm">
            {checkSteps.map((s, i) => (
              <div key={s}>
                <div className="font-mono text-primary">STEP 0{i + 1}</div>
                <p className="mt-1 text-muted-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 mt-10 space-y-6 text-muted-foreground">
        <div>
          <h2 className="font-display text-2xl text-foreground">Dates and evidence</h2>
          <p className="mt-2">
            App release: {REG.edition}. Dataset snapshot: {REG.provenance.snapshotAsOf}. Publication
            and effective dates describe the source; verification dates describe a review. Legacy
            review dates are inherited, not proof that the current audit confirmed every rule. The
            Sources page distinguishes reviewed passages, pending applicability reviews and
            unavailable retrievals. A blocked source is not a withdrawn restriction.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">India-route reporting</h2>
          <p className="mt-2">
            Nepal Airlines publishes a MOBIKINS MK-PB-04 India-sector restriction citing DGCA AIC
            14/2026. The primary DGCA circular has not been independently reviewed here. Treat the
            carrier notice as carrier evidence and verify your exact route directly; do not infer
            universal regulatory clearance or prohibition from secondary reporting alone.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">
            Privacy and current capabilities
          </h2>
          <p className="mt-2">
            Model, capacity and serial inputs are evaluated locally against the bundled dataset. No
            live CPSC lookup or photo recognition is implemented in this app. Fonts are requested
            from Google; opening cited links visits external websites. Hosting may receive request
            information, and platform error reporting may receive errors and page context.
            Hosting-log retention has not been verified. No promise is made that all website traffic
            stays on your device.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Review accountability</h2>
          <p className="mt-2">
            The named publisher, accountable editor and correction contact have not yet been
            supplied. Until those details and the unresolved source reviews are complete, this
            remains a reference tool under review, not a certified launch-ready safety service.
          </p>
        </div>
      </section>
    </>
  ),
});
