import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PERSONS, type Status, type Task } from '../model'
import { TaskCard } from './TaskCard'
import { TASK_PREFIX, cellKey, parseCell, resolveDropTarget, taskId } from './dropTarget'

const STATUSES: { key: Status; label: string }[] = [
  { key: 'todo', label: 'Offen' },
  { key: 'doing', label: 'In Arbeit' },
  { key: 'done', label: 'Erledigt' },
]

/** Personen-Zeilen des Boards (feste Liste plus «Niemand»). */
const ROWS: { personId: string | null; label: string; initials: string | null }[] = [
  ...PERSONS.map((p) => ({ personId: p.id, label: p.name, initials: p.initials })),
  { personId: null, label: 'Niemand', initials: null },
]

function personLabel(personId: string | null): string {
  if (personId === null) {
    return 'Niemand'
  }
  return PERSONS.find((p) => p.id === personId)?.name ?? personId
}

const dropAnimation: DropAnimation = {
  duration: 250,
  easing: 'ease',
}

const announcements = {
  onDragStart({ active }: { active: { id: UniqueIdentifier } }) {
    return `Karte ${active.id} wird gezogen.`
  },
  onDragOver({ active, over }: { active: { id: UniqueIdentifier }; over?: { id: UniqueIdentifier } | null }) {
    if (over) {
      return `Karte ${active.id} ist über ${over.id}.`
    }
    return ''
  },
  onDragEnd({ active, over }: { active: { id: UniqueIdentifier }; over?: { id: UniqueIdentifier } | null }) {
    if (over) {
      return `Karte ${active.id} wurde auf ${over.id} abgelegt.`
    }
    return 'Ziehen beendet.'
  },
  onDragCancel({ active }: { active: { id: UniqueIdentifier } }) {
    return `Ziehen von ${active.id} abgebrochen.`
  },
}

function SortableCard({
  task,
  onToggle,
  onRemove,
  onRestore,
  onAssign,
}: {
  task: Task
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: () => void
  onAssign: (id: string, personId: string | null) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${TASK_PREFIX}${task.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : undefined}
    >
      <TaskCard
        task={task}
        onToggle={onToggle}
        onRemove={onRemove}
        onRestore={onRestore}
        onAssign={onAssign}
      />
    </div>
  )
}

function Cell({
  personId,
  status,
  tasks,
  isOver,
  onToggle,
  onRemove,
  onRestore,
  onAssign,
}: {
  personId: string | null
  status: Status
  tasks: Task[]
  isOver: boolean
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: () => void
  onAssign: (id: string, personId: string | null) => void
}) {
  const { setNodeRef, isOver: cellOver } = useDroppable({
    id: cellKey(personId, status),
  })
  const statusLabel = STATUSES.find((s) => s.key === status)!.label
  const over = isOver || cellOver

  return (
    <section
      ref={setNodeRef}
      aria-label={`${personLabel(personId)} – ${statusLabel}`}
      className={`glass flex min-h-64 flex-col gap-3 rounded-2xl border p-3 transition-look ${
        over ? 'glow scale-[1.01]' : ''
      }`}
    >
      <h2 className="font-heading text-lg">{statusLabel}</h2>
      {tasks.length === 0 ? (
        <p className="m-auto rounded-xl border-2 border-dashed border-ring/60 p-6 text-center text-muted-foreground">
          Hierher ziehen
        </p>
      ) : (
        <SortableContext
          items={tasks.map((t) => `${TASK_PREFIX}${t.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <SortableCard
                  task={task}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  onRestore={onRestore}
                  onAssign={onAssign}
                />
              </li>
            ))}
          </ul>
        </SortableContext>
      )}
    </section>
  )
}

export function Board({
  tasks,
  onToggle,
  onRemove,
  onRestore,
  onAssign,
  onMove,
  onCelebrateMove,
}: {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: () => void
  onAssign: (id: string, personId: string | null) => void
  onMove: (id: string, status: Status, personId: string | null, index: number) => void
  onCelebrateMove: (taskId: string, toStatus: Status) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overCell, setOverCell] = useState<{ personId: string | null; status: Status } | null>(null)

  const activeTask = useMemo(
    () => (activeId ? tasks.find((t) => t.id === activeId) ?? null : null),
    [activeId, tasks],
  )

  function handleDragStart(event: DragEndEvent) {
    setActiveId(taskId(event.active.id) || null)
  }

  function handleDragOver(event: DragOverEvent) {
    const over = event.over
    if (!over) {
      setOverCell(null)
      return
    }
    const parsed = parseCell(over.id)
    if (parsed) {
      setOverCell(parsed)
    } else {
      const overTask = tasks.find((t) => t.id === taskId(over.id))
      setOverCell(overTask ? { personId: overTask.personId, status: overTask.status } : null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    setOverCell(null)

    const activeTaskId = taskId(active.id)
    if (!activeTaskId || !over) {
      return
    }

    const target = resolveDropTarget(tasks, activeTaskId, over.id)
    if (!target) {
      return
    }
    const { personId, status, index } = target
    const taskSnapshot = tasks.find((t) => t.id === activeTaskId)
    if (!taskSnapshot) {
      return
    }

    if (status === 'done' && taskSnapshot.status !== 'done') {
      onCelebrateMove(activeTaskId, status)
    }

    onMove(activeTaskId, status, personId, index)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners as CollisionDetection}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null)
        setOverCell(null)
      }}
    >
      <div className="flex flex-col gap-6">
        {ROWS.map((row) => {
          const rowTasks = tasks.filter((t) => t.personId === row.personId)
          return (
            <section
              key={row.personId ?? 'niemand'}
              aria-label={`Zeile ${row.label}`}
              className="flex flex-col gap-3"
            >
              <header className="flex items-center gap-2">
                <span
                  className={`grid size-8 place-items-center rounded-full bg-secondary font-mono text-sm font-semibold text-secondary-foreground ${
                    row.initials ? '' : 'opacity-60'
                  }`}
                >
                  {row.initials ?? '–'}
                </span>
                <h2 className="font-heading text-xl">{row.label}</h2>
              </header>
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible">
                {STATUSES.map((s) => (
                  <div key={s.key} className="w-[85vw] shrink-0 snap-center md:w-auto">
                    <Cell
                      personId={row.personId}
                      status={s.key}
                      tasks={rowTasks.filter((t) => t.status === s.key)}
                      isOver={overCell?.personId === row.personId && overCell.status === s.key}
                      onToggle={onToggle}
                      onRemove={onRemove}
                      onRestore={onRestore}
                      onAssign={onAssign}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="shadow-pop rotate-2">
            <TaskCard
              task={activeTask}
              onToggle={onToggle}
              onRemove={onRemove}
              onRestore={onRestore}
              onAssign={onAssign}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
