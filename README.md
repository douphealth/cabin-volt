# CabinVolt — Can this power bank fly?

A fast, private power bank checker for air travel. It checks one unit against curated official recalls, 22 airline policies and the ICAO rule in force since 27 March 2026 (no more than 2 power banks, no recharging them in flight). Every verdict links to the official page it comes from.

## Features
- **Live checker** – the verdict updates as you type, with an animated watt-hour gauge. It applies serial, batch, seller and India-route rules.
- **Airline comparison** – search and sort by power bank count, Wh limit and whether you can use it onboard.
- **Recall library** – filter by brand. Each model shows its scope, serial prefixes and the airlines that refuse it.
- **Wh calculator** – sliders convert mAh × cell voltage, with the 100 Wh and 160 Wh marks shown.
- **Methodology and sources** – authority order, known limitations and a review date for every source.

## Principles
- Safety first: the strictest finding wins, and "verify" is never shown as "OK".
- A model that isn't in the list is never treated as cleared.
- All checks run in the browser. No tracking.

## Stack
TanStack Start (React 19), Vite, Tailwind CSS v4. Data lives in `src/data/registry.json`; the rule engine is in `src/lib/logic.ts`.

```bash
bun install
bun run dev
bunx vitest run
```

## Disclaimer
CabinVolt is a dated reference, not a flight clearance. The operating airline and crew have the final word.
