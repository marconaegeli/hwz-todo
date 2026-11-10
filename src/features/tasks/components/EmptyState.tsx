export function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
      {/* Aurora: Mond mit drei Sternen */}
      <svg
        className="hidden size-30 [[data-look=aurora]_&]:block"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="68" cy="60" r="34" className="fill-accent" opacity="0.9" />
        <circle cx="52" cy="50" r="30" className="fill-card" />
        <circle cx="90" cy="30" r="3" className="fill-accent animate-pulse" />
        <circle cx="28" cy="34" r="3" className="fill-accent animate-pulse" />
        <circle cx="104" cy="66" r="2.5" className="fill-accent animate-pulse" />
      </svg>

      {/* Candy: lächelnde Wolke */}
      <svg
        className="hidden size-30 [[data-look=candy]_&]:block"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <g className="fill-accent">
          <circle cx="40" cy="72" r="22" />
          <circle cx="62" cy="58" r="26" />
          <circle cx="84" cy="70" r="20" />
          <rect x="34" y="66" width="56" height="22" rx="11" />
        </g>
        <circle cx="52" cy="70" r="3" className="fill-secondary-foreground" />
        <circle cx="72" cy="70" r="3" className="fill-secondary-foreground" />
        <path
          d="M56 82 q6 7 12 0"
          stroke="currentColor"
          className="text-secondary-foreground"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Neon: Blitz in einem Kreis */}
      <svg
        className="hidden size-30 [[data-look=neon]_&]:block glow rounded-full"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="48" className="stroke-primary" strokeWidth="3" fill="none" />
        <polygon
          points="66,28 44,64 58,64 54,92 78,54 63,54 70,28"
          className="fill-accent"
        />
      </svg>

      <p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>
    </div>
  )
}
