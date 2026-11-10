import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('shows the friendly message and hint', () => {
    render(<EmptyState />)
    expect(screen.getByText('Alles erledigt. Zeit für Kaffee.')).toBeInTheDocument()
    expect(screen.getByText(/Tippe oben eine neue Aufgabe ein/)).toBeInTheDocument()
  })
})
