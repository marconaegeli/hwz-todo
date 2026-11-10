import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Board } from './Board'
import { resolveDropTarget } from './dropTarget'
import type { Task } from '../model'

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Aufgabe',
    status: 'todo',
    personId: null,
    createdAt: 0,
    ...overrides,
  }
}

function renderBoard(tasks: Task[]) {
  return render(
    <Board
      tasks={tasks}
      onToggle={vi.fn()}
      onRemove={vi.fn()}
      onRestore={vi.fn()}
      onAssign={vi.fn()}
      onMove={vi.fn()}
      onCelebrateMove={vi.fn()}
    />,
  )
}

describe('Board', () => {
  it('renders the three columns for a person and for Niemand', () => {
    renderBoard([task()])
    const irisRow = screen.getByLabelText('Zeile Iris')
    expect(within(irisRow).getByRole('heading', { name: 'Offen' })).toBeInTheDocument()
    expect(within(irisRow).getByRole('heading', { name: 'In Arbeit' })).toBeInTheDocument()
    expect(within(irisRow).getByRole('heading', { name: 'Erledigt' })).toBeInTheDocument()
    expect(screen.getByLabelText('Zeile Niemand')).toBeInTheDocument()
  })

  it('shows a card in the column and row of its status and person', () => {
    const irisTask = task({
      id: 'a',
      title: 'Einsatzplan',
      status: 'doing',
      personId: 'iris',
    })
    const unassigned = task({
      id: 'b',
      title: 'Protokoll',
      status: 'todo',
      personId: null,
    })
    renderBoard([irisTask, unassigned])

    const irisDoing = screen.getByLabelText('Iris – In Arbeit')
    expect(within(irisDoing).getByText('Einsatzplan')).toBeInTheDocument()

    const nooneTodo = screen.getByLabelText('Niemand – Offen')
    expect(within(nooneTodo).getByText('Protokoll')).toBeInTheDocument()
  })

  it('shows an empty hint in a column without cards', () => {
    renderBoard([])
    const nooneTodo = screen.getByLabelText('Niemand – Offen')
    expect(within(nooneTodo).getByText('Hierher ziehen')).toBeInTheDocument()
  })
})

describe('resolveDropTarget', () => {
  const a = task({ id: 'a', title: 'A', status: 'todo', personId: 'iris' })
  const b = task({ id: 'b', title: 'B', status: 'todo', personId: 'iris' })
  const c = task({ id: 'c', title: 'C', status: 'done', personId: null })
  const tasks = [a, b, c]

  it('resolves a drop into a specific cell', () => {
    expect(resolveDropTarget(tasks, 'a', 'cell:null:doing')).toEqual({
      status: 'doing',
      personId: null,
      index: 0,
    })
  })

  it('places the card at the position of the hovered card', () => {
    // Zellinhalt Iris–Offen = [b]; a über b abgelegt → index 0
    expect(resolveDropTarget(tasks, 'a', 'task:b')).toEqual({
      status: 'todo',
      personId: 'iris',
      index: 0,
    })
  })

  it('appends at the end when the cell is empty', () => {
    expect(resolveDropTarget(tasks, 'a', 'cell:marco:todo')).toEqual({
      status: 'todo',
      personId: 'marco',
      index: 0,
    })
  })

  it('returns null for an unknown over id', () => {
    expect(resolveDropTarget(tasks, 'a', 'nope')).toBeNull()
  })
})
