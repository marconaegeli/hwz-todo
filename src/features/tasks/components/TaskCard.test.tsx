import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from './TaskCard'
import type { Task } from '../model'
import { Toaster } from '@/components/ui/sonner'
import { celebrate } from '@/lib/celebrate'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

const task: Task = { id: '1', title: 'Einkaufen', status: 'todo', personId: null, createdAt: 0 }

function renderCard(overrides: Partial<{ onToggle: (id: string) => void; onRemove: (t: typeof task) => void; onRestore: () => void; onAssign: (id: string, personId: string | null) => void }> = {}) {
  return render(
    <>
      <Toaster richColors position="bottom-center" />
      <TaskCard
        task={task}
        onToggle={overrides.onToggle ?? vi.fn()}
        onRemove={overrides.onRemove ?? vi.fn()}
        onRestore={overrides.onRestore ?? vi.fn()}
        onAssign={overrides.onAssign ?? vi.fn()}
      />
    </>,
  )
}

describe('TaskCard', () => {
  beforeEach(() => {
    vi.mocked(celebrate).mockClear()
  })

  it('toggles done on checkbox click and celebrates an open task', () => {
    const onToggle = vi.fn()
    renderCard({ onToggle })
    fireEvent.click(screen.getByLabelText('«Einkaufen» erledigt'))
    expect(onToggle).toHaveBeenCalledWith('1')
    expect(celebrate).toHaveBeenCalled()
  })

  it('removes on delete and offers restore via toast', async () => {
    const onRemove = vi.fn()
    const onRestore = vi.fn()
    renderCard({ onRemove, onRestore })
    fireEvent.click(screen.getByLabelText('«Einkaufen» löschen'))
    expect(onRemove).toHaveBeenCalledWith(task)
    expect(await screen.findByText('Aufgabe gelöscht')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Rückgängig'))
    expect(onRestore).toHaveBeenCalled()
  })
})
