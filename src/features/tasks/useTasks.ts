import { useCallback, useEffect, useState } from 'react'
import {
  addTask,
  assignPerson,
  changeStatus,
  insertTask,
  moveTask,
  removeTask,
  toggleTask,
  type Status,
  type Task,
} from './model'
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

  const changeStatusHandler = useCallback((id: string, status: Status) => {
    setTasks((prev) => changeStatus(prev, id, status))
  }, [])

  const assignPersonHandler = useCallback((id: string, personId: string | null) => {
    setTasks((prev) => assignPerson(prev, id, personId))
  }, [])

  const move = useCallback(
    (id: string, toStatus: Status, toPersonId: string | null, toIndex: number) => {
      setTasks((prev) => moveTask(prev, id, toStatus, toPersonId, toIndex))
    },
    [],
  )

  const remove = useCallback((id: string) => {
    setTasks((prev) => removeTask(prev, id))
  }, [])

  const restore = useCallback(
    (task: Task, index: number) => {
      setTasks((prev) => insertTask(prev, task, index))
    },
    [],
  )

  return {
    tasks,
    addTask: add,
    toggleTask: toggle,
    changeStatus: changeStatusHandler,
    assignPerson: assignPersonHandler,
    moveTask: move,
    removeTask: remove,
    restoreTask: restore,
  }
}
