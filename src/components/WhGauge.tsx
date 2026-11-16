export function WhGauge({ wh, max = 200 }: { wh: number | null; max?: number }) {
  const v = wh == null ? 0 : Math.min(wh, max);
  const pct = v / max;
  const r = 80, c = Math.PI * r;
  const color = wh == null ? "var(--muted-foreground)" : wh > 160 ? "var(--danger)" : wh > 100 ? "var(--caution)" : "var(--safe)";
  const tick = (w: number) => {
    const a = Math.PI * (1 - w / max);
    return { x: 100 + Math.cos(a) * 92, y: 100 - Math.sin(a) * 92 };
  };
  return (
    <svg viewBox="0 0 200 118" className="w-full max-w-xs" role="img" aria-label={wh == null ? "No rating" : `${wh} watt-hours`}>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--secondary)" strokeWidth="14" strokeLinecap="round" />
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.2,.7,.2,1), stroke .4s" }} />
      {[100, 160].map((w) => { const p = tick(w); return <g key={w}><circle cx={p.x} cy={p.y} r="2.5" fill="var(--foreground)" /><text x={p.x} y={p.y - 6} fontSize="8" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">{w}</text></g>; })}
      <text x="100" y="88" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--foreground)" fontFamily="var(--font-display)">{wh == null ? "—" : wh}</text>
      <text x="100" y="106" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-mono)" letterSpacing="2">WATT-HOURS</text>
    </svg>
  );
}
