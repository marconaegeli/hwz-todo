import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskInput } from './TaskInput'

describe('TaskInput', () => {
  it('adds a task on Enter and clears the field', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TaskInput onAdd={onAdd} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    await user.type(input, 'Einkaufen{Enter}')
    expect(onAdd).toHaveBeenCalledWith('Einkaufen')
    expect(input).toHaveValue('')
  })

  it('does not call onAdd for whitespace-only input', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TaskInput onAdd={onAdd} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    await user.type(input, '   {Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('focuses the input when pressing N', () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    fireEvent.keyDown(window, { key: 'n' })
    expect(input).toHaveFocus()
  })
})
