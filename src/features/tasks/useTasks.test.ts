import { describe, expect, it, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import { loadState } from '@/lib/storage'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })

  it('adds a task and persists it', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Einkaufen')
    })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Einkaufen')
    expect(loadState().tasks).toHaveLength(1)
  })

  it('restores stored tasks on load', () => {
    localStorage.setItem('hwz-todo', JSON.stringify({ version: 1, tasks: [{ id: 'x', title: 'Alt', done: false, createdAt: 1 }] }))
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Alt')
  })

  it('toggles a task and persists the change', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('A')
    })
    const id = result.current.tasks[0].id
    act(() => {
      result.current.toggleTask(id)
    })
    expect(result.current.tasks[0].done).toBe(true)
    expect(loadState().tasks[0].done).toBe(true)
  })
})
