import { useCallback, useEffect, useState } from 'react'
import { addTask, insertTask, removeTask, toggleTask, type Task } from './model'
import { loadState, saveState } from '@/lib/storage'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)

  useEffect(() => {
    saveState(tasks)
  }, [tasks])

  const add = useCallback((title: string) => {
    setTasks((prev) => addTask(prev, title))
  }, [])

  const toggle = useCallback((id: string) => {
    setTasks((prev) => toggleTask(prev, id))
  }, [])

  const remove = useCallback((id: string) => {
    setTasks((prev) => removeTask(prev, id))
  }, [])

  const restore = useCallback(
    (task: Task, index: number) => {
      setTasks((prev) => insertTask(prev, task, index))
    },
    [],
  )

  return { tasks, addTask: add, toggleTask: toggle, removeTask: remove, restoreTask: restore }
}
