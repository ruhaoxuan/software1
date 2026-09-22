import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTaskStore } from '../../src/stores/task.store'
import type { TaskRepository } from '../../src/infrastructure/task-repository.types'
import type { Task } from '../../src/domain/task.types'

function memoryRepository(): TaskRepository & { saved: number } {
  let tasks: Task[] = []
  return {
    saved: 0,
    load: () => tasks,
    save(next) { tasks = structuredClone(next); this.saved += 1 },
    clear() { tasks = [] },
  }
}

describe('task store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('creates, updates, moves and deletes tasks', () => {
    const store = useTaskStore(); store.setRepository(memoryRepository()); store.initialize()
    const created = store.createTask({ title: '准备演示', priority: 'high' })
    expect(created.ok).toBe(true)
    if (!created.ok) return
    const updated = store.updateTask(created.value.id, { title: '准备课堂演示', description: '十分钟' })
    expect(updated.ok).toBe(true)
    expect(store.moveTask(created.value.id, 'done').ok).toBe(true)
    expect(store.tasksByStatus('done')).toHaveLength(1)
    expect(store.deleteTask(created.value.id).ok).toBe(true)
    expect(store.tasks).toHaveLength(0)
  })

  it('does not update a task timestamp when moving to its current status', () => {
    const store = useTaskStore(); store.setRepository(memoryRepository()); store.initialize()
    const created = store.createTask({ title: '不移动' })
    if (!created.ok) return
    const before = created.value.updatedAt
    expect(store.moveTask(created.value.id, 'todo').ok).toBe(true)
    expect(store.getTaskById(created.value.id)?.updatedAt).toBe(before)
  })
})
