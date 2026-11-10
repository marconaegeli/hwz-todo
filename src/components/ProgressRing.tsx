import { motion } from 'motion/react'

const RADIUS = 30
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const ratio = total === 0 ? 0 : done / total
  const offset = CIRCUMFERENCE * (1 - ratio)

  return (
    <div
      role="img"
      aria-label={`${done} von ${total} erledigt`}
      className="relative size-18 shrink-0"
    >
      <svg width={72} height={72} viewBox="0 0 72 72" aria-hidden="true" className="size-full">
        <circle
          cx={36}
          cy={36}
          r={RADIUS}
          strokeWidth={8}
          fill="none"
          className="stroke-muted"
          transform="rotate(-90 36 36)"
        />
        <motion.circle
          cx={36}
          cy={36}
          r={RADIUS}
          strokeWidth={8}
          fill="none"
          className="stroke-accent"
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-mono text-sm font-semibold">
        {done}/{total}
      </div>
    </div>
  )
}
