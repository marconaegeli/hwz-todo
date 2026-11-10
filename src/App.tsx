import { useRef } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useTasks } from '@/features/tasks/useTasks'
import type { Task } from '@/features/tasks/model'
import { Board } from '@/features/tasks/components/Board'
import { EmptyState } from '@/features/tasks/components/EmptyState'
import { TaskInput } from '@/features/tasks/components/TaskInput'
import { ProgressRing } from '@/components/ProgressRing'
import { celebrate } from '@/lib/celebrate'

export default function App() {
  const { tasks, addTask, toggleTask, assignPerson, moveTask, removeTask, restoreTask } = useTasks()
  const lastRemoved = useRef<{ task: Task; index: number } | null>(null)

  const done = tasks.filter((t) => t.status === 'done').length
  const today = new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  function handleRemove(task: Task) {
    const index = tasks.findIndex((t) => t.id === task.id)
    lastRemoved.current = { task, index }
    removeTask(task.id)
  }

  function handleRestore() {
    const entry = lastRemoved.current
    if (!entry) {
      return
    }
    lastRemoved.current = null
    restoreTask(entry.task, entry.index)
  }

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-gradient font-heading text-5xl font-bold tracking-tight sm:text-6xl">
                Meine Aufgaben
              </h1>
              <p className="mt-2 text-muted-foreground">{today}</p>
            </div>
            <ProgressRing done={done} total={tasks.length} />
          </header>
          <TaskInput onAdd={addTask} />
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <Board
              tasks={tasks}
              onToggle={toggleTask}
              onRemove={handleRemove}
              onRestore={handleRestore}
              onAssign={assignPerson}
              onMove={moveTask}
              onCelebrateMove={() => {
                celebrate()
              }}
            />
          )}
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
