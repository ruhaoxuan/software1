import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { EditableTaskPatch, Result, Task, TaskDraft, TaskStatus } from '../domain/task.types'
import { validateTaskDraft } from '../domain/task.validation'
import { LocalStorageTaskRepository } from '../infrastructure/local-storage-task.repository'
import type { TaskRepository } from '../infrastructure/task-repository.types'

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const initialized = ref(false)
  const storageError = ref<string | null>(null)
  let repository: TaskRepository = new LocalStorageTaskRepository()

  const taskCounts = computed(() => ({
    todo: tasks.value.filter((task) => task.status === 'todo').length,
    in_progress: tasks.value.filter((task) => task.status === 'in_progress').length,
    done: tasks.value.filter((task) => task.status === 'done').length,
  }))

  function tasksByStatus(status: TaskStatus): Task[] {
    return tasks.value.filter((task) => task.status === status)
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find((task) => task.id === id)
  }

  function persist(nextTasks: Task[]): Result {
    try {
      repository.save(nextTasks)
      return { ok: true, value: undefined }
    } catch {
      storageError.value = '无法保存到浏览器本地存储；刷新页面后最近修改可能丢失。'
      return { ok: false, code: 'STORAGE', message: storageError.value }
    }
  }

  function initialize(): void {
    if (initialized.value) return
    try {
      tasks.value = repository.load()
    } catch (error) {
      tasks.value = []
      storageError.value = error instanceof Error ? error.message : '本地任务数据无法读取。'
    } finally {
      initialized.value = true
    }
  }

  function createTask(draft: TaskDraft): Result<Task> {
    const checked = validateTaskDraft(draft)
    if (!checked.valid) return { ok: false, code: 'VALIDATION', message: checked.message }
    const now = new Date().toISOString()
    const task: Task = { id: createId(), ...checked.value, createdAt: now, updatedAt: now }
    const nextTasks = [...tasks.value, task]
    tasks.value = nextTasks
    const saved = persist(nextTasks)
    return saved.ok ? { ok: true, value: task } : saved
  }

  function updateTask(id: string, patch: EditableTaskPatch): Result<Task> {
    const current = getTaskById(id)
    if (!current) return { ok: false, code: 'NOT_FOUND', message: '未找到该任务，它可能已经被删除。' }
    const checked = validateTaskDraft({ ...current, ...patch })
    if (!checked.valid) return { ok: false, code: 'VALIDATION', message: checked.message }
    const changed = current.title !== checked.value.title || current.description !== checked.value.description
      || current.status !== checked.value.status || current.priority !== checked.value.priority
    if (!changed) return { ok: true, value: current }
    const updated: Task = { ...current, ...checked.value, updatedAt: new Date().toISOString() }
    const nextTasks = tasks.value.map((task) => task.id === id ? updated : task)
    tasks.value = nextTasks
    const saved = persist(nextTasks)
    return saved.ok ? { ok: true, value: updated } : saved
  }

  function deleteTask(id: string): Result {
    if (!getTaskById(id)) return { ok: false, code: 'NOT_FOUND', message: '未找到该任务，它可能已经被删除。' }
    const nextTasks = tasks.value.filter((task) => task.id !== id)
    tasks.value = nextTasks
    return persist(nextTasks)
  }

  function moveTask(id: string, status: TaskStatus): Result<Task> {
    const current = getTaskById(id)
    if (!current) return { ok: false, code: 'NOT_FOUND', message: '未找到该任务，它可能已经被删除。' }
    if (current.status === status) return { ok: true, value: current }
    return updateTask(id, { status })
  }

  function clearStorageError(): void { storageError.value = null }
  // Used only by tests to isolate the persistence boundary.
  function setRepository(nextRepository: TaskRepository): void { repository = nextRepository }

  return { tasks, initialized, storageError, taskCounts, tasksByStatus, getTaskById, initialize, createTask, updateTask, deleteTask, moveTask, clearStorageError, setRepository }
})
