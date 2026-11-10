import { describe, expect, it, beforeEach } from 'vitest'
import { loadState, saveState, CURRENT_VERSION } from './storage'
import type { Task } from '../features/tasks/model'

const task = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test',
  done: false,
  createdAt: 0,
  ...overrides,
})

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty state when the key is missing', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty state for broken JSON', () => {
    localStorage.setItem('hwz-todo', 'not-json')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty state for the wrong shape', () => {
    localStorage.setItem('hwz-todo', JSON.stringify({ version: 1, tasks: 'nope' }))
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('round-trips a saved state', () => {
    const state = { version: CURRENT_VERSION, tasks: [task({ title: 'A' })] }
    saveState(state.tasks)
    expect(loadState()).toEqual(state)
  })
})
