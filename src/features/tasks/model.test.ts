import { describe, expect, it } from 'vitest'
import { addTask, changeStatus, assignPerson, moveTask, toggleTask, removeTask } from './model'

describe('addTask', () => {
  it('adds a task with trimmed title and id', () => {
    const tasks = addTask([], '  Einkaufen  ')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Einkaufen')
    expect(tasks[0].status).toBe('todo')
    expect(tasks[0].personId).toBeNull()
    expect(tasks[0].id).toBeTruthy()
    expect(tasks[0].createdAt).toBeGreaterThan(0)
  })

  it('ignores an empty or whitespace-only title', () => {
    expect(addTask([], '')).toEqual([])
    expect(addTask([], '   ')).toEqual([])
  })

  it('truncates a title longer than 200 characters', () => {
    const long = 'x'.repeat(300)
    const tasks = addTask([], long)
    expect(tasks[0].title).toHaveLength(200)
  })
})

describe('toggleTask', () => {
  it('toggles the status of a task between todo and done', () => {
    const first = addTask([], 'A')
    const second = addTask(first, 'B')
    expect(second).toHaveLength(2)
    const toggled = toggleTask(second, second[0].id)
    expect(toggled.find((t) => t.id === second[0].id)?.status).toBe('done')
    expect(toggled.find((t) => t.id === second[1].id)?.status).toBe('todo')
  })
})

describe('removeTask', () => {
  it('removes a task and keeps the others', () => {
    const first = addTask([], 'A')
    const tasks = addTask(first, 'B')
    const remaining = removeTask(tasks, tasks[0].id)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].title).toBe('A')
  })
})

describe('changeStatus', () => {
  it('sets a new status on a task', () => {
    const tasks = addTask([], 'A')
    const changed = changeStatus(tasks, tasks[0].id, 'doing')
    expect(changed[0].status).toBe('doing')
  })

  it('leaves the list unchanged when the id is missing', () => {
    const tasks = addTask([], 'A')
    expect(changeStatus(tasks, 'nope', 'doing')).toEqual(tasks)
  })
})

describe('assignPerson', () => {
  it('assigns a person to a task', () => {
    const tasks = addTask([], 'A')
    const assigned = assignPerson(tasks, tasks[0].id, 'marco')
    expect(assigned[0].personId).toBe('marco')
  })

  it('removes the person again with null', () => {
    const tasks = assignPerson(addTask([], 'A'), addTask([], 'A')[0].id, 'marco')
    const cleared = assignPerson(tasks, tasks[0].id, null)
    expect(cleared[0].personId).toBeNull()
  })

  it('leaves the list unchanged when the id is missing', () => {
    const tasks = addTask([], 'A')
    expect(assignPerson(tasks, 'nope', 'marco')).toEqual(tasks)
  })
})

describe('moveTask', () => {
  function build() {
    const a = createTask('A')
    const b = createTask('B')
    const c = createTask('C')
    const d = createTask('D')
    const tasks = [a, b, c, d]
    // B und C in eine andere Spalte verschieben, um Positionen zu prüfen
    const moved = changeStatus(tasks, b.id, 'done')
    const moved2 = changeStatus(moved, c.id, 'done')
    return { tasks: moved2, a, b, c, d }
  }

  it('moves a card into a column at a given index', () => {
    const { tasks, c } = build()
    // Spalten: todo = [A, D], done = [B, C]
    const result = moveTask(tasks, c.id, 'todo', null, 0)
    expect(result.find((t) => t.id === c.id)?.status).toBe('todo')
    expect(result.find((t) => t.id === c.id)).not.toBe(c)
  })

  it('keeps the relative order of the target column', () => {
    const { tasks, a, c, d } = build()
    const result = moveTask(tasks, c.id, 'todo', null, 1)
    // Zielspalte todo hatte Reihenfolge [A, D]; C an Index 1 ergibt [A, C, D]
    const todoOrder = result.filter((t) => t.status === 'todo').map((t) => t.id)
    expect(todoOrder).toEqual([a.id, c.id, d.id])
  })

  it('clamps the index to the column length', () => {
    const { tasks, a, c, d } = build()
    const result = moveTask(tasks, c.id, 'todo', null, 99)
    const todoOrder = result.filter((t) => t.status === 'todo').map((t) => t.id)
    expect(todoOrder).toEqual([a.id, d.id, c.id])
  })

  it('assigns the new person when moving between rows', () => {
    const { tasks, c } = build()
    const result = moveTask(tasks, c.id, 'todo', 'iris', 0)
    const moved = result.find((t) => t.id === c.id)
    expect(moved?.status).toBe('todo')
    expect(moved?.personId).toBe('iris')
  })

  it('keeps the relative order within the target person row', () => {
    const { tasks, a, c } = build()
    // C in Iris-Zeile verschieben; die todo-Zelle von Iris enthält nur C
    const result = moveTask(tasks, c.id, 'todo', 'iris', 0)
    const irisTodo = result.filter(
      (t) => t.status === 'todo' && t.personId === 'iris',
    )
    expect(irisTodo.map((t) => t.id)).toEqual([c.id])
    // A bleibt unangetastet in Niemand
    expect(result.find((t) => t.id === a.id)?.personId).toBeNull()
  })

  it('leaves the list unchanged when the id is missing', () => {
    const tasks = addTask([], 'A')
    expect(moveTask(tasks, 'nope', 'todo', null, 0)).toEqual(tasks)
  })
})

function createTask(title: string) {
  return {
    id: title,
    title,
    status: 'todo' as const,
    personId: null,
    createdAt: 0,
  }
}
