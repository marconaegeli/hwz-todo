export type Status = 'todo' | 'doing' | 'done'

export type Person = {
  id: string
  name: string // z. B. «Marco»
  initials: string // z. B. «MN»
}

export type Task = {
  id: string
  title: string
  status: Status
  personId: string | null // null = «Niemand»
  createdAt: number
}

export const PERSONS: Person[] = [
  { id: 'iris', name: 'Iris', initials: 'IR' },
  { id: 'laurin', name: 'Laurin', initials: 'LA' },
  { id: 'nevio', name: 'Nevio', initials: 'NE' },
  { id: 'marco', name: 'Marco', initials: 'MA' },
]

export function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title.slice(0, 200),
    status: 'todo',
    personId: null,
    createdAt: Date.now(),
  }
}

export function addTask(tasks: Task[], title: string): Task[] {
  const trimmed = title.trim().slice(0, 200)
  if (trimmed.length === 0) {
    return tasks
  }
  return [createTask(trimmed), ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) =>
    t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t,
  )
}

export function changeStatus(tasks: Task[], id: string, status: Status): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, status } : t))
}

export function assignPerson(tasks: Task[], id: string, personId: string | null): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, personId } : t))
}

export function moveTask(
  tasks: Task[],
  id: string,
  toStatus: Status,
  toPersonId: string | null,
  toIndex: number,
): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    return tasks
  }
  const moved = { ...task, status: toStatus, personId: toPersonId }
  const rest = tasks.filter((t) => t.id !== id)
  const targetCell = rest.filter(
    (t) => t.status === toStatus && t.personId === toPersonId,
  )
  const position = Math.max(0, Math.min(toIndex, targetCell.length))
  const pivotId = targetCell[position]?.id ?? null

  let inserted = false
  const result: Task[] = []
  for (const t of rest) {
    if (!inserted && pivotId !== null && t.id === pivotId) {
      result.push(moved)
      inserted = true
    }
    result.push(t)
  }
  if (!inserted) {
    result.push(moved)
  }
  return result
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}

export function insertTask(tasks: Task[], task: Task, index: number): Task[] {
  const next = [...tasks]
  next.splice(index, 0, task)
  return next
}
