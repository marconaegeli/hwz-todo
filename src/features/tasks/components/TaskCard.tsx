import { useRef } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { celebrate } from '@/lib/celebrate'
import type { Task } from '../model'

export function TaskCard({
  task,
  onToggle,
  onRemove,
  onRestore,
}: {
  task: Task
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: () => void
}) {
  const checkRef = useRef<HTMLSpanElement>(null)

  function handleToggle() {
    const el = checkRef.current
    let origin: { x: number; y: number } | undefined
    if (el) {
      const rect = el.getBoundingClientRect()
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      }
    }
    if (!task.done) {
      celebrate(origin)
    }
    onToggle(task.id)
  }

  function handleRemove() {
    onRemove(task)
    toast('Aufgabe gelöscht', {
      action: { label: 'Rückgängig', onClick: onRestore },
      duration: 5000,
    })
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="group glass flex items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow"
    >
      <span ref={checkRef} className="shrink-0">
        <Checkbox
          checked={task.done}
          onCheckedChange={handleToggle}
          aria-label={`«${task.title}» erledigt`}
          className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        />
      </span>
      <span className="relative min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
        <span className={task.done ? 'text-muted-foreground' : undefined}>{task.title}</span>
        <motion.span
          aria-hidden
          className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
          initial={false}
          animate={{ scaleX: task.done ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`«${task.title}» löschen`}
        onClick={handleRemove}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  )
}
