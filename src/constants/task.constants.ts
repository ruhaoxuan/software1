import type { TaskPriority, TaskStatus } from '../domain/task.types'

export const TASK_STORAGE_KEY = 'task-manager.tasks'
export const THEME_STORAGE_KEY = 'task-manager.theme'

export const STATUS_OPTIONS: ReadonlyArray<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '完成' },
]

export const PRIORITY_OPTIONS: ReadonlyArray<{ value: TaskPriority; label: string }> = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export const STATUS_LABELS: Record<TaskStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<TaskStatus, string>

export const PRIORITY_LABELS: Record<TaskPriority, string> = Object.fromEntries(
  PRIORITY_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<TaskPriority, string>
