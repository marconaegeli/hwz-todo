import confetti from 'canvas-confetti'
import { readConfettiColors } from '@/lib/theme'

export function celebrate(origin?: { x: number; y: number }) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors: readConfettiColors(),
    origin,
  })
}
