import { useRef, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useHotkey } from '@/lib/useHotkey'

export function TaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useHotkey('n', inputRef)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setShaking(true)
      return
    }
    onAdd(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShaking(false)}
      className={`glass flex items-center gap-2 rounded-2xl border p-2 shadow-card${shaking ? ' animate-shake' : ''}`}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-14 flex-1 border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"
        placeholder="Was steht an?"
        aria-label="Neue Aufgabe"
        maxLength={200}
      />
      <Button
        type="submit"
        size="icon"
        className="size-12 rounded-xl bg-primary text-primary-foreground transition-look hover:scale-105 active:scale-95"
        aria-label="Aufgabe hinzufügen"
      >
        <Plus className="size-6" />
      </Button>
    </form>
  )
}
