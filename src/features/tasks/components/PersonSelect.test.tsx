import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PersonSelect } from './PersonSelect'
import { PERSONS } from '../model'

describe('PersonSelect', () => {
  it('shows the initials of the assigned person', () => {
    render(<PersonSelect personId="iris" onAssign={vi.fn()} />)
    expect(screen.getByLabelText('Person zuweisen')).toHaveTextContent('IR')
  })

  it('shows a placeholder badge when no person is assigned', () => {
    render(<PersonSelect personId={null} onAssign={vi.fn()} />)
    expect(screen.getByLabelText('Person zuweisen')).toHaveTextContent('+')
  })

  it('assigns a person on click', async () => {
    const user = userEvent.setup()
    const onAssign = vi.fn()
    render(<PersonSelect personId={null} onAssign={onAssign} />)
    await user.click(screen.getByLabelText('Person zuweisen'))
    await user.click(screen.getByText('Laurin'))
    expect(onAssign).toHaveBeenCalledWith('laurin')
  })

  it('lists every person in the menu', async () => {
    const user = userEvent.setup()
    render(<PersonSelect personId={null} onAssign={vi.fn()} />)
    await user.click(screen.getByLabelText('Person zuweisen'))
    for (const p of PERSONS) {
      expect(screen.getByText(p.name)).toBeInTheDocument()
    }
  })
})
