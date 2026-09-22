import { TASK_STORAGE_KEY } from '../constants/task.constants'
import type { PersistedTaskStateV1, Task } from '../domain/task.types'
import { isTaskPriority, isTaskStatus } from '../domain/task.validation'
import type { TaskRepository } from './task-repository.types'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function browserStorage(): StorageLike {
  if (typeof window === 'undefined' || !window.localStorage) throw new Error('浏览器存储不可用。')
  return window.localStorage
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return typeof task.id === 'string' && task.id.length > 0
    && typeof task.title === 'string' && task.title.trim().length >= 1 && task.title.length <= 100
    && typeof task.description === 'string' && task.description.length <= 1000
    && isTaskStatus(task.status) && isTaskPriority(task.priority)
    && isIsoDate(task.createdAt) && isIsoDate(task.updatedAt)
}

function parseState(raw: string): Task[] | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const state = parsed as PersistedTaskStateV1
    if (state.version !== 1 || !Array.isArray(state.tasks) || !state.tasks.every(isTask)) return null
    const ids = new Set(state.tasks.map((task) => task.id))
    return ids.size === state.tasks.length ? state.tasks : null
  } catch {
    return null
  }
}

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(private readonly storage: StorageLike = browserStorage()) {}

  load(): Task[] {
    const raw = this.storage.getItem(TASK_STORAGE_KEY)
    if (raw === null) return []
    const tasks = parseState(raw)
    if (tasks) return tasks

    // Keep the source available for manual recovery, then allow the app to start safely.
    try {
      this.storage.setItem(`${TASK_STORAGE_KEY}.corrupt.${Date.now()}`, raw)
    } catch {
      // A full or blocked storage must not prevent recovery to an empty board.
    }
    this.storage.removeItem(TASK_STORAGE_KEY)
    throw new Error('本地任务数据无法读取，已恢复为空看板。')
  }

  save(tasks: Task[]): void {
    const state: PersistedTaskStateV1 = { version: 1, tasks }
    this.storage.setItem(TASK_STORAGE_KEY, JSON.stringify(state))
  }

  clear(): void {
    this.storage.removeItem(TASK_STORAGE_KEY)
  }
}
