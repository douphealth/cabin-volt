import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, ShieldCheck, X, Zap } from "lucide-react";
import { REG } from "@/lib/registry";

// "/" is the hand-designed static homepage (src/home/serve.ts). It is linked with a plain <a>:
// a router <Link to="/"> would render the old React index route in place instead of loading it.
const nav = [
  { to: "/airlines", label: "Airlines" },
  { to: "/models", label: "Recalls" },
  { to: "/calculator", label: "Wh Calculator" },
  { to: "/portable-charger-on-plane", label: "Flying Rules" },
  { to: "/100wh-power-banks", label: "100 Wh Picks" },
  { to: "/methodology", label: "Method" },
  { to: "/sources", label: "Sources" },
] as const;

const pill = "px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors";
const pillOn = { className: "bg-slate-800/80 text-white" };

/** Logo lock-up copied from the homepage design: gradient-ringed bolt, wordmark, AVIATION tag. */
function Brand() {
  return (
    <a href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="size-9 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-amber-400 p-[1.5px] shadow-lg shadow-sky-500/20">
        <span className="flex size-full items-center justify-center rounded-[10px] bg-background">
          <Zap className="size-5 text-amber-400 transition-transform group-hover:scale-110" aria-hidden="true" />
        </span>
      </span>
      <span>
        <span className="flex items-center gap-1.5 text-lg leading-none font-extrabold tracking-tight">
          CabinVolt
          <span className="rounded border border-sky-500/25 bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-300">AVIATION</span>
        </span>
        <span className="mt-1 hidden text-[11px] text-slate-400 sm:block">Instant source-backed battery check</span>
      </span>
    </a>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[rgb(13_20_36/0.82)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand />
          <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 text-sm font-medium xl:flex">
            <a href="/#check" className={pill}>Check</a>
            {nav.map((n) => <Link key={n.to} to={n.to} className={pill} activeProps={pillOn}>{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href="/#check" className="btn-sky hidden px-4 py-2 text-xs sm:inline-flex"><ShieldCheck className="size-4" aria-hidden="true" />Instant Check</a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="site-menu" aria-label="Toggle menu"
              className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-2 xl:hidden">
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        <nav id="site-menu" aria-label="All pages" hidden={!open} className="border-t border-slate-800/80 px-4 py-3 sm:px-6 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 text-sm font-medium sm:grid-cols-2 md:grid-cols-4">
            <a href="/#check" className={pill}>Check</a>
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={pill} activeProps={pillOn}>{n.label}</Link>)}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-24 border-t border-slate-800/80 py-10">
        <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-base font-extrabold">
              <Zap className="size-4 text-amber-400" aria-hidden="true" />CabinVolt
              <span className="font-mono text-xs font-normal text-slate-500">· Release {REG.edition}</span>
            </div>
            <div className="font-mono text-xs text-slate-400">
              Dataset snapshot {REG.provenance.snapshotAsOf} · {REG.models.length} models · {REG.airlines.length} airlines · {Object.keys(REG.sources).length} sources
            </div>
          </div>
          <p className="max-w-4xl text-xs leading-relaxed text-slate-400">{REG.coverageNote} CabinVolt is a dated reference check, never a flight clearance. The operating airline and crew have the final word.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
            <a href="/" className="hover:text-primary">Home</a>
            {nav.map((n) => <Link key={n.to} to={n.to} className="hover:text-primary">{n.label}</Link>)}
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 animate-rise">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-gradient max-w-4xl leading-[1.05]">{title}</h1>
      {children && <div className="mt-5 text-lg text-muted-foreground max-w-2xl">{children}</div>}
    </section>
  );
}

export function LevelBadge({ level }: { level: "danger" | "caution" | "info" }) {
  const cls = level === "danger" ? "bg-danger/15 text-danger border-danger/40" : level === "caution" ? "bg-caution/15 text-caution border-caution/40" : "bg-safe/15 text-safe border-safe/40";
  const label = level === "danger" ? "STOP" : level === "caution" ? "VERIFY" : "CHECKED";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-widest ${cls}`}><span className="size-1.5 rounded-full bg-current" />{label}</span>;
}
