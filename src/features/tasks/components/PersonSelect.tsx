import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERSONS, type Person } from '../model'

function initialsOf(personId: string | null): string {
  if (personId === null) {
    return '+'
  }
  return PERSONS.find((p) => p.id === personId)?.initials ?? '?'
}

export function PersonSelect({
  personId,
  onAssign,
}: {
  personId: string | null
  onAssign: (personId: string | null) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Person zuweisen"
        className="grid size-8 place-items-center rounded-full bg-secondary font-mono text-xs font-semibold text-secondary-foreground transition-look hover:scale-105"
      >
        {initialsOf(personId)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {PERSONS.map((p: Person) => (
          <DropdownMenuItem key={p.id} onSelect={() => onAssign(p.id)}>
            <span className="font-mono">{p.initials}</span> {p.name}
            {personId === p.id ? ' ✓' : ''}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onSelect={() => onAssign(null)}>
          – Niemand
          {personId === null ? ' ✓' : ''}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
