import type { Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 1

export type State = {
  version: number
  tasks: Task[]
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
        typeof (t as Task).done === 'boolean' &&
        typeof (t as Task).createdAt === 'number',
    )
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

export function loadState(): State {
  const value = loadRaw()
  if (isEmptyState(value)) {
    return { version: CURRENT_VERSION, tasks: value.tasks }
  }
  return { version: CURRENT_VERSION, tasks: [] }
}

export function saveState(tasks: Task[]): void {
  const state: State = { version: CURRENT_VERSION, tasks }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
