import { describe, expect, it } from 'vitest'
import { addTask, toggleTask, removeTask } from './model'

describe('addTask', () => {
  it('adds a task with trimmed title and id', () => {
    const tasks = addTask([], '  Einkaufen  ')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Einkaufen')
    expect(tasks[0].done).toBe(false)
    expect(tasks[0].id).toBeTruthy()
    expect(tasks[0].createdAt).toBeGreaterThan(0)
  })

  it('ignores an empty or whitespace-only title', () => {
    expect(addTask([], '')).toEqual([])
    expect(addTask([], '   ')).toEqual([])
  })

  it('truncates a title longer than 200 characters', () => {
    const long = 'x'.repeat(300)
    const tasks = addTask([], long)
    expect(tasks[0].title).toHaveLength(200)
  })
})

describe('toggleTask', () => {
  it('toggles the done flag of a task', () => {
    const first = addTask([], 'A')
    const second = addTask(first, 'B')
    expect(second).toHaveLength(2)
    const toggled = toggleTask(second, second[0].id)
    expect(toggled.find((t) => t.id === second[0].id)?.done).toBe(true)
    expect(toggled.find((t) => t.id === second[1].id)?.done).toBe(false)
  })
})

describe('removeTask', () => {
  it('removes a task and keeps the others', () => {
    const first = addTask([], 'A')
    const tasks = addTask(first, 'B')
    const remaining = removeTask(tasks, tasks[0].id)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].title).toBe('A')
  })
})
