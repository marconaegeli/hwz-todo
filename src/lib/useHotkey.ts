import { useEffect, type RefObject } from 'react'

export function useHotkey(key: string, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key !== key) {
        return
      }
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      event.preventDefault()
      ref.current?.focus()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, ref])
}
