import { AnimatePresence } from 'motion/react'
import type { Task } from '../model'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

export function TaskList({
  tasks,
  onToggle,
  onRemove,
  onRestore,
  onAssign = () => {},
}: {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: () => void
  onAssign?: (id: string, personId: string | null) => void
}) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onRemove={onRemove}
            onRestore={onRestore}
            onAssign={onAssign}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}
