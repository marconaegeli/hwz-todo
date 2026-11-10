import type { Status, Task } from '../model'

export const TASK_PREFIX = 'task:'
const CELL_PREFIX = 'cell:'

export function taskId(id: unknown): string {
  return typeof id === 'string' && id.startsWith(TASK_PREFIX)
    ? id.slice(TASK_PREFIX.length)
    : ''
}

export function cellKey(personId: string | null, status: Status): string {
  return `${CELL_PREFIX}${personId ?? 'null'}:${status}`
}

export function parseCell(id: unknown): { personId: string | null; status: Status } | null {
  if (typeof id !== 'string' || !id.startsWith(CELL_PREFIX)) {
    return null
  }
  const body = id.slice(CELL_PREFIX.length)
  const sep = body.lastIndexOf(':')
  if (sep === -1) {
    return null
  }
  const personRaw = body.slice(0, sep)
  const status = body.slice(sep + 1) as Status
  if (status !== 'todo' && status !== 'doing' && status !== 'done') {
    return null
  }
  return { personId: personRaw === 'null' ? null : personRaw, status }
}

/**
 * Reine Funktion: berechnet das Ziel einer fallen gelassenen Karte.
 * overId ist entweder eine Karten-Id (task:…) oder eine Zelle (cell:…).
 */
export function resolveDropTarget(
  tasks: Task[],
  activeTaskId: string,
  overId: unknown,
): { status: Status; personId: string | null; index: number } | null {
  const targetCell =
    parseCell(overId) ??
    (() => {
      const overTask = tasks.find((t) => t.id === taskId(overId))
      return overTask ? { personId: overTask.personId, status: overTask.status } : null
    })()

  if (!targetCell) {
    return null
  }
  const { personId, status } = targetCell

  const inCell = tasks.filter(
    (t) => t.id !== activeTaskId && t.status === status && t.personId === personId,
  )
  const overTaskId = taskId(overId)
  let index = inCell.length
  if (overTaskId) {
    const pos = inCell.findIndex((t) => t.id === overTaskId)
    if (pos !== -1) {
      index = pos
    }
  }
  return { status, personId, index }
}
