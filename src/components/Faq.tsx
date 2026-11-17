import type { ReactNode } from "react";

export type QA = { q: string; a: string };

/** Visible FAQ + matching FAQPage JSON-LD (answers are plain text so schema and page always agree). */
export function Faq({ items, title = "Frequently asked questions" }: { items: QA[]; title?: string }) {
  if (!items.length) return null;
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  }).replace(/</g, "\\u003c");
  return (
    <section className="mx-auto max-w-6xl px-5 mt-10">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">{title}</h2>
      <div className="mt-4 divide-y border rounded-2xl">
        {items.map((x) => (
          <details key={x.q} className="group p-5" open>
            <summary className="cursor-pointer font-medium list-none flex justify-between gap-4">{x.q}<span className="text-muted-foreground group-open:rotate-45 transition">+</span></summary>
            <p className="mt-2 text-muted-foreground leading-relaxed">{x.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
    </section>
  );
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 mt-10">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">{title}</h2>
      <div className="mt-4 text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
