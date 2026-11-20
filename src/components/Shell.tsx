import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { REG } from "@/lib/registry";

const nav = [
  { to: "/", label: "Check" },
  { to: "/airlines", label: "Airlines" },
  { to: "/models", label: "Recalls" },
  { to: "/calculator", label: "Wh calculator" },
  { to: "/portable-charger-on-plane", label: "Flying rules" },
  { to: "/methodology", label: "Method" },
  { to: "/sources", label: "Sources" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <img src="/favicon.svg" alt="" className="size-7" />
            Cabin<span className="text-primary">Volt</span>
          </Link>
          <nav className="hidden md:flex gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "bg-secondary text-foreground" }}>{n.label}</Link>
            ))}
          </nav>
          <span className="ml-auto hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
            App release {REG.edition}
          </span>
        </div>
        <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="shrink-0 px-3 py-1 rounded-full text-muted-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>{n.label}</Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-24">
        <div className="mx-auto max-w-6xl px-5 py-10 grid gap-6 md:grid-cols-[2fr_1fr] text-sm text-muted-foreground">
          <p className="max-w-xl">{REG.coverageNote} CabinVolt is a dated reference check, never a flight clearance. The operating airline and crew have the final word.</p>
          <div className="flex flex-col gap-1 md:items-end font-mono text-xs">
            <span>Dataset snapshot {REG.provenance.snapshotAsOf}</span>
            <span>{REG.models.length} models · {REG.airlines.length} airlines · {Object.keys(REG.sources).length} sources</span>
            <Link to="/methodology" className="text-primary hover:underline">Evidence & methodology →</Link>
            <Link to="/privacy" className="text-primary hover:underline">Privacy policy →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 animate-rise">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient max-w-4xl">{title}</h1>
      {children && <div className="mt-5 text-lg text-muted-foreground max-w-2xl">{children}</div>}
    </section>
  );
}

export function LevelBadge({ level }: { level: "danger" | "caution" | "info" }) {
  const cls = level === "danger" ? "bg-danger/15 text-danger border-danger/40" : level === "caution" ? "bg-caution/15 text-caution border-caution/40" : "bg-safe/15 text-safe border-safe/40";
  const label = level === "danger" ? "STOP" : level === "caution" ? "VERIFY" : "CHECKED";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-widest ${cls}`}><span className="size-1.5 rounded-full bg-current" />{label}</span>;
}
