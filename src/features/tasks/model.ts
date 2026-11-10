export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

export function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title: title.slice(0, 200),
    done: false,
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
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}

export function insertTask(tasks: Task[], task: Task, index: number): Task[] {
  const next = [...tasks]
  next.splice(index, 0, task)
  return next
}
