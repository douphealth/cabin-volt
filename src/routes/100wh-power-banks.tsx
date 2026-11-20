import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/Shell";
import { Faq, type QA } from "@/components/Faq";
import { AmazonPicks, type Pick } from "@/components/AmazonPicks";
import { FAA_URL, mahFor, whFrom } from "@/lib/flying-rules";

const TITLE = "100Wh power banks: the biggest you can fly with";
const DESC = "What a 100Wh power bank is, how many mAh that equals (about 27,000 mAh at 3.7 V), why airlines use 100Wh as the limit, and what to check before you buy.";

const PICKS: Pick[] = [
  { label: "99Wh laptop power bank", query: "99Wh laptop power bank USB-C PD", why: "The largest size most airlines accept without approval. Check the Wh printed on the case." },
  { label: "25,600–26,800 mAh power bank", query: "26800mAh power bank", why: "About 95–99 Wh at 3.7 V: high capacity while staying under 100 Wh." },
  { label: "100W USB-C power bank for laptops", query: "100W USB-C power bank laptop", why: "High output for charging a laptop; capacity still needs to be under 100 Wh." },
  { label: "Power bank travel case", query: "power bank travel case", why: "Keeps terminals protected in your carry-on." },
];

const FAQ: QA[] = [
  { q: "How many mAh is 100Wh?", a: `About ${mahFor(100).toLocaleString("en")} mAh at a 3.7 V cell voltage, or about ${mahFor(100, 3.6).toLocaleString("en")} mAh at 3.6 V. Divide 100,000 by the cell voltage to work it out.` },
  { q: "Can I take a 100Wh power bank on a plane?", a: "Yes, in carry-on. FAA guidance allows lithium-ion batteries up to 100 Wh without airline approval. They are not allowed in checked luggage." },
  { q: "Is a 27,000 mAh power bank under 100Wh?", a: `At 3.7 V, 27,000 mAh is about ${whFrom(27000)} Wh, just under 100 Wh. Many makers stop at 26,800 mAh or 25,600 mAh to stay clearly under the limit.` },
  { q: "Why are so many power banks rated 99Wh?", a: "Because 100 Wh is the threshold above which airlines need to approve a spare battery. Rating a power bank at 99 Wh keeps it in the no-approval category." },
];

export const Route = createFileRoute("/100wh-power-banks")({
  head: () => ({ meta: [
    { title: `${TITLE} | CabinVolt` }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC }, { property: "og:type", content: "article" },
  ] }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHead eyebrow="Power bank sizes" title={TITLE}>
        A 100Wh power bank is the largest most airlines accept without approval. That works out at about {mahFor(100).toLocaleString("en")} mAh at a typical 3.7 V cell voltage.
      </PageHead>
      <section className="mx-auto max-w-6xl px-5 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Why 100Wh matters</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">Aviation rules measure batteries in watt-hours, not mAh, because watt-hours reflect the stored energy whatever the cell voltage. The FAA allows lithium-ion batteries up to 100 Wh in carry-on without airline approval, and up to two spares of 101–160 Wh with approval.</p>
          <p className="mt-3 text-muted-foreground leading-relaxed">That is why so many large power banks are rated 99 Wh, or sold as 25,600 mAh or 26,800 mAh: they are built to sit just under the line.</p>
          <p className="mt-3 text-sm text-muted-foreground">Source: <a className="text-primary hover:underline" href={FAA_URL} target="_blank" rel="noopener noreferrer">FAA PackSafe: Lithium Batteries</a>.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">What to check before you buy</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
            <li>The <strong className="text-foreground">Wh rating printed on the case</strong>. Security staff look for it; a missing rating can mean the unit is refused.</li>
            <li>The <strong className="text-foreground">cell voltage</strong> used for the mAh figure, usually 3.6–3.85 V, not the 5 V USB output.</li>
            <li><strong className="text-foreground">Output power</strong> (for example 65 W or 100 W USB-C) if you want to charge a laptop.</li>
            <li>Whether the model appears on a <Link to="/models" className="text-primary hover:underline">recall list</Link>.</li>
          </ul>
          <p className="mt-4 text-sm"><Link to="/calculator" className="text-primary hover:underline">Convert any mAh to Wh →</Link> · <Link to="/portable-charger-on-plane" className="text-primary hover:underline">Full flying rules →</Link></p>
        </div>
      </section>
      <Faq items={FAQ} />
      <AmazonPicks title="High-capacity power banks under 100Wh" intro="Confirm the Wh printed on the exact unit you buy, and your airline's limits." picks={PICKS} />
    </>
  );
}
