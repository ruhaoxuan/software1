export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'
export type ThemePreference = 'light' | 'dark'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface TaskDraft {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface PersistedTaskStateV1 {
  version: 1
  tasks: Task[]
}

export type EditableTaskPatch = Partial<TaskDraft>

export type Result<T = void> =
  | { ok: true; value: T }
  | { ok: false; code: 'VALIDATION' | 'NOT_FOUND' | 'STORAGE'; message: string }
