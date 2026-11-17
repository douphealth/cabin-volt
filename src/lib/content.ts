import { REG, scopeLabel, yesNo, type Airline, type Model } from "@/lib/registry";
import type { QA } from "@/components/Faq";

/** Long-form page copy derived only from registry fields — no invented facts. */

export const NOMINAL_V = 3.7;
export const CAPACITIES = [5000, 10000, 20000, 26800, 30000, 40000];
export const mahToWh = (mah: number) => Math.round((mah * NOMINAL_V) / 100) / 10;

const banks = (n: number) => (n === 1 ? "one power bank" : `${n} power banks`);
export const verified = (a: Airline) => a.maxWh != null && a.limit != null;

export function whVerdict(a: Airline, wh: number): "Allowed" | "With approval" | "Not allowed" | "Check airline" {
  if (!verified(a)) return "Check airline";
  const max = a.maxWh as number;
  if (wh <= 100 && (a.maxExclusive ? wh < max : wh <= max)) return "Allowed";
  if (wh > 100 && wh <= 160 && a.large === "approval") return "With approval";
  return "Not allowed";
}

function useText(a: Airline) {
  switch (a.use) {
    case "no": return `You cannot charge a phone or other device from a power bank during a ${a.short} flight.`;
    case "yes": return `${a.short} allows using a power bank to charge devices in flight.`;
    case "restricted": case "limited": return `${a.short} only allows in-flight use under restrictions set out in its policy, so read the conditions before relying on it.`;
    default: return `Our records do not confirm whether ${a.short} allows charging devices from a power bank in flight, so ask the crew before using one.`;
  }
}
function rechargeText(a: Airline) {
  if (a.recharge === "no") return `Recharging the power bank itself from a seat outlet or USB port is not allowed.`;
  if (a.recharge === "yes") return `Recharging the power bank from the seat supply is allowed.`;
  return `Whether you may recharge the power bank from the seat supply is not confirmed in our records.`;
}
function largeText(a: Airline) {
  if (a.large === "approval") return `Power banks rated between 100 and 160 Wh need ${a.short}'s approval before travel; anything above 160 Wh is refused.`;
  if (a.large === "no") return `Power banks above 100 Wh are not accepted.`;
  return "";
}

export function airlineAnswer(a: Airline): string {
  if (!verified(a)) {
    return `We have not verified ${a.name}'s numeric power-bank limits yet${a.banRecalled ? `, but its policy refuses recalled power banks` : ""}. Check the official ${a.short} source linked on this page before you fly. Power banks are never allowed in checked baggage under ICAO dangerous-goods rules.`;
  }
  return `Yes, with limits. ${a.name} allows ${banks(a.limit as number)} per passenger in cabin baggage, each ${a.maxExclusive ? "under" : "up to"} ${a.maxWh} Wh. ${largeText(a)} ${useText(a)} ${rechargeText(a)} Power banks are never allowed in checked baggage.`.replace(/\s+/g, " ").trim();
}

export function airlineStats(a: Airline) {
  const v = REG.airlines.filter(verified);
  return {
    total: v.length,
    oneBank: v.filter((x) => x.limit === 1).length,
    noUse: v.filter((x) => x.use === "no").length,
    approval: v.filter((x) => x.large === "approval").length,
    isOneBank: a.limit === 1,
  };
}

/** Closest verified peers: same bank limit and Wh ceiling first, then the rest. */
export function peers(a: Airline, n = 6) {
  const score = (x: Airline) => (x.limit === a.limit ? 2 : 0) + (x.maxWh === a.maxWh ? 1 : 0);
  return REG.airlines.filter((x) => x.id !== a.id && verified(x)).sort((x, y) => score(y) - score(x) || x.name.localeCompare(y.name)).slice(0, n);
}

export function airlineFaq(a: Airline): QA[] {
  const src = REG.sources[a.source];
  const srcTxt = src ? ` Source: ${src.name}.` : "";
  const twenty = mahToWh(20000);
  const out: QA[] = [];
  if (verified(a)) {
    out.push({ q: `How many power banks can I take on ${a.short}?`, a: `${a.name} allows ${banks(a.limit as number)} per passenger, carried in cabin baggage only.${srcTxt}` });
    out.push({ q: `What is the maximum power bank size on ${a.short}?`, a: `Each power bank must be ${a.maxExclusive ? "under" : "at most"} ${a.maxWh} Wh. ${largeText(a)}`.trim() });
    out.push({ q: `Is a 20,000 mAh power bank allowed on ${a.short}?`, a: `A typical 20,000 mAh power bank is about ${twenty} Wh (20,000 × ${NOMINAL_V} V ÷ 1000), so on ${a.short} it is: ${whVerdict(a, twenty).toLowerCase()}. Always check the Wh value printed on your own unit.` });
  } else {
    out.push({ q: `How many power banks can I take on ${a.short}?`, a: `We have not verified ${a.short}'s numeric limit. Check the airline's official dangerous-goods page before you fly.${srcTxt}` });
  }
  out.push({ q: `Can I use a power bank during a ${a.short} flight?`, a: `${useText(a)} ${rechargeText(a)}` });
  out.push({ q: `Can I put a power bank in checked luggage on ${a.short}?`, a: `No. Spare lithium batteries, including power banks, are banned from checked baggage under ICAO dangerous-goods rules that apply to every airline. Keep it in your carry-on with the terminals protected.` });
  out.push({ q: `Does ${a.short} ban recalled power banks?`, a: a.banRecalled ? `Yes. ${a.name}'s policy refuses power banks that are subject to a recall${a.bannedModels?.length ? `, including specific named models listed on this page` : ""}.` : `Our records do not show a specific recalled-unit rule for ${a.short}, but a recalled power bank is a fire risk on any flight. Check your model before travelling.` });
  return out;
}

const SCOPE_TXT: Record<string, string> = {
  all: "The notice covers every unit of this model.",
  "serial-check": "Only some units are affected, so the serial number on your unit decides whether it is included.",
  "serial-prefix": "Units are identified by the start of their serial number.",
  "batch-check": "Affected units are identified by production batch.",
  "batch-date": "Affected units are identified by manufacture date.",
  "manufacture-range": "Affected units fall within a stated manufacture date range.",
  "no-date-code": "Units without a printed date code are affected.",
  "seller-us-amazon": "The notice covers units sold through a specific US seller.",
  "seller-us": "The notice covers units sold through a specific US seller.",
  "route-india": "This is a regulator restriction on certain routes rather than a manufacturer recall.",
};
export const scopeText = (m: Model) => SCOPE_TXT[m.scope] ?? `Scope: ${scopeLabel(m.scope)}.`;

export const refusingAirlines = (m: Model) => REG.airlines.filter((a) => a.bannedModels?.includes(m.id) || (a.banRecalled && m.issue === "recall"));

export function modelAnswer(m: Model): string {
  const isRecall = m.issue === "recall";
  return `${isRecall ? `Do not fly with an affected ${m.brand} ${m.model} ${m.name}.` : `The ${m.brand} ${m.model} ${m.name} is subject to a ${m.issue.replace(/-/g, " ")}.`} ${scopeText(m)} ${m.serialPrefixes?.length ? `Affected serial prefixes: ${m.serialPrefixes.join(", ")}.` : ""} ${isRecall ? "Stop using and charging it until you have confirmed your unit is not included." : ""}`.replace(/\s+/g, " ").trim();
}

export function modelSteps(m: Model): string[] {
  return [
    `Find the model number on the case or under the label and confirm it reads ${m.model}.`,
    m.serialPrefixes?.length ? `Compare the serial number with the affected prefixes: ${m.serialPrefixes.join(", ")}.` : `Note the serial number, batch code or manufacture date printed on the unit.`,
    `Check it against ${m.brand}'s official recall instructions${(m as Model & { actionUrl?: string }).actionUrl ? " (linked below)" : ""} and follow their refund or replacement process.`,
    `Until confirmed, stop charging it and keep it out of both carry-on and checked baggage.`,
    `Never put a lithium power bank in household waste; take it to a battery recycling point or follow the manufacturer's return steps.`,
  ];
}

export function modelFaq(m: Model): QA[] {
  const air = refusingAirlines(m);
  const isRecall = m.issue === "recall";
  return [
    { q: `Is the ${m.brand} ${m.model} recalled?`, a: isRecall ? `Yes. ${m.description}` : m.description },
    { q: `Can I take the ${m.brand} ${m.model} on a plane?`, a: isRecall ? `Not if your unit is affected. Airlines and safety regulators treat recalled lithium batteries as unsafe to fly. ${scopeText(m)}` : `${m.description}` },
    { q: `How do I check if my ${m.model} is affected?`, a: modelSteps(m).slice(0, 3).join(" ") },
    { q: `Which airlines refuse the ${m.brand} ${m.model}?`, a: air.length ? `In our records: ${air.map((a) => a.name).join(", ")}. Any airline's crew can refuse a battery they consider unsafe.` : `No airline in our records names it specifically, but crews can refuse any battery they consider unsafe, and recalled units should not be flown.` },
    { q: `What should I do with a recalled ${m.model}?`, a: `Stop using it, follow ${m.brand}'s official refund or replacement process, and recycle it at a battery collection point rather than household waste.` },
  ];
}

export const verdictClass = (v: string) => (v === "Allowed" ? "text-safe" : v === "Not allowed" ? "text-danger" : "text-caution");
export { yesNo };
