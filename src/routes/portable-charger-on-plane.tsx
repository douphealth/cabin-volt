import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/Shell";
import { Faq, type QA } from "@/components/Faq";
import { AmazonPicks } from "@/components/AmazonPicks";
import { POWER_BANK_PICKS } from "@/lib/picks";
import { FAA_URL, TSA_URL, TABLE_MAH, verdict, whFrom } from "@/lib/flying-rules";

const TITLE = "Can you bring a portable charger on a plane?";
const DESC = "Yes, in your carry-on only. Power banks up to 100 Wh need no approval; 101–160 Wh need airline approval; never in checked bags. Rules, mAh table and tips.";

const FAQ: QA[] = [
  { q: "Can I bring a portable charger on a plane?", a: "Yes. In the United States, TSA allows power banks in carry-on bags only. Power banks with a lithium-ion battery are prohibited in checked luggage." },
  { q: "What size power bank can I take on a plane?", a: "FAA guidance limits lithium-ion batteries to 100 watt-hours each without airline approval. With airline approval you may also carry up to two spare batteries of 101–160 Wh. Anything over 160 Wh is not allowed as a passenger spare." },
  { q: "Is a 20,000 mAh power bank allowed on a plane?", a: `Usually yes. At a typical 3.7 V cell voltage, 20,000 mAh is about ${whFrom(20000)} Wh, under the 100 Wh limit. Check the Wh rating printed on your unit, and your airline's own rules.` },
  { q: "Can I put a power bank in checked luggage?", a: "No. Spare lithium batteries, including power banks and phone chargers, are prohibited in checked bags. If a gate agent checks your carry-on, take the power bank out first." },
  { q: "Can I use a power bank during the flight?", a: "That depends on the airline. Several airlines now restrict charging from power banks on board, or require them to stay visible. Check your airline's page before you fly." },
];

export const Route = createFileRoute("/portable-charger-on-plane")({
  head: () => ({ meta: [
    { title: `${TITLE} | CabinVolt` }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC }, { property: "og:type", content: "article" },
  ] }),
  component: Page,
});

const TIERS: [string, string][] = [
  ["Up to 100 Wh", "Carry-on. No airline approval needed. Covers almost every phone power bank."],
  ["101–160 Wh", "Carry-on with airline approval. Up to two spare batteries per passenger."],
  ["Over 160 Wh", "Not allowed as a passenger spare battery. Large power stations usually fall here."],
];

function Page() {
  return (
    <>
      <PageHead eyebrow="Flying with a power bank" title={TITLE}>
        Yes, in your carry-on bag. Never in checked luggage. Power banks up to 100 Wh need no approval; 101–160 Wh need your airline's approval.
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid gap-6 md:grid-cols-3">
        {TIERS.map(([h, b]) => (
          <div key={h} className="panel p-6"><p className="font-display text-2xl font-bold text-primary">{h}</p><p className="mt-2 text-muted-foreground">{b}</p></div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">The rules in plain English</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
            <li><strong className="text-foreground">Carry-on only.</strong> TSA says portable chargers with a lithium-ion battery must be packed in carry-on bags and are prohibited in checked luggage.</li>
            <li><strong className="text-foreground">Size is measured in watt-hours.</strong> The FAA limit is 100 Wh per battery without approval, and up to two spares of 101–160 Wh with airline approval.</li>
            <li><strong className="text-foreground">Protect the terminals.</strong> Keep each power bank in its own pouch or case so the contacts cannot short against keys or coins.</li>
            <li><strong className="text-foreground">Airlines can be stricter.</strong> Some limit how many power banks you carry or ban charging from them during the flight.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Sources: <a className="text-primary hover:underline" href={TSA_URL} target="_blank" rel="noopener noreferrer">TSA: Power Banks</a> · <a className="text-primary hover:underline" href={FAA_URL} target="_blank" rel="noopener noreferrer">FAA PackSafe: Lithium Batteries</a>. The final decision rests with security staff and your airline.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Common sizes at a glance</h2>
          <p className="mt-2 text-sm text-muted-foreground">Estimated at 3.7 V. Always trust the Wh printed on your unit.</p>
          <table className="mt-4 w-full text-sm">
            <thead><tr className="text-left text-muted-foreground"><th className="py-2">Capacity</th><th>≈ Wh</th><th>Typical status</th></tr></thead>
            <tbody>{TABLE_MAH.map((m) => { const wh = whFrom(m); return <tr key={m} className="border-t"><td className="py-2 font-mono">{m.toLocaleString("en")} mAh</td><td className="font-mono">{wh}</td><td>{verdict(wh)}</td></tr>; })}</tbody>
          </table>
          <p className="mt-3 text-sm"><Link to="/calculator" className="text-primary hover:underline">Convert your exact mAh and voltage →</Link></p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 mt-10">
        <h2 className="font-display text-2xl font-semibold">Check your airline and your model</h2>
        <p className="mt-2 text-muted-foreground">Rules on in-flight use and how many power banks you may carry vary by airline, and some models have been recalled. <Link to="/airlines" className="text-primary hover:underline">See airline rules →</Link> · <Link to="/models" className="text-primary hover:underline">Check recalled models →</Link> · <a href="/#check" className="text-primary hover:underline">Run the full check →</a></p>
      </section>
      <Faq items={FAQ} />
      <AmazonPicks title="Power banks you can fly with" intro="Every option below is under 100 Wh. Always confirm the Wh printed on the exact unit you buy." picks={POWER_BANK_PICKS} />
    </>
  );
}
