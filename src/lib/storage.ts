import type { Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 2

export type State = {
  version: number
  tasks: Task[]
}

type V1Task = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

function isEmptyState(value: unknown): value is State {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const state = value as Record<string, unknown>
  const tasks = state.tasks
  return (
    typeof state.version === 'number' &&
    Array.isArray(tasks) &&
    tasks.every(
      (t): t is Task =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Task).id === 'string' &&
        typeof (t as Task).title === 'string' &&
        ((t as Task).status === 'todo' ||
          (t as Task).status === 'doing' ||
          (t as Task).status === 'done') &&
        ((t as Task).personId === null || typeof (t as Task).personId === 'string') &&
        typeof (t as Task).createdAt === 'number',
    )
  )
}

function isV1Task(t: unknown): t is V1Task {
  return (
    typeof t === 'object' &&
    t !== null &&
    typeof (t as V1Task).id === 'string' &&
    typeof (t as V1Task).title === 'string' &&
    typeof (t as V1Task).done === 'boolean' &&
    typeof (t as V1Task).createdAt === 'number'
  )
}

export function migrateV1toV2(task: V1Task): Task {
  return {
    id: task.id,
    title: task.title,
    status: task.done ? 'done' : 'todo',
    personId: null,
    createdAt: task.createdAt,
  }
}

export function loadState(): State {
  const value = loadRaw()
  if (isStateV2(value)) {
    return { version: CURRENT_VERSION, tasks: value.tasks }
  }
  if (isStateV1(value)) {
    return { version: CURRENT_VERSION, tasks: value.tasks.map(migrateV1toV2) }
  }
  return { version: CURRENT_VERSION, tasks: [] }
}

function isStateV2(value: unknown): value is State {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const state = value as Record<string, unknown>
  return state.version === 2 && isEmptyState({ version: 2, tasks: state.tasks })
}

function isStateV1(value: unknown): value is { version: 1; tasks: V1Task[] } {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const state = value as Record<string, unknown>
  return (
    state.version === 1 &&
    Array.isArray(state.tasks) &&
    state.tasks.every(isV1Task)
  )
}

function loadRaw(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return undefined
    }
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function saveState(tasks: Task[]): void {
  const state: State = { version: CURRENT_VERSION, tasks }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
