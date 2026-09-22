import type { TaskDraft, TaskPriority, TaskStatus } from './task.types'

const statuses: TaskStatus[] = ['todo', 'in_progress', 'done']
const priorities: TaskPriority[] = ['high', 'medium', 'low']

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && statuses.includes(value as TaskStatus)
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === 'string' && priorities.includes(value as TaskPriority)
}

export function validateTaskDraft(draft: TaskDraft): { valid: true; value: Required<TaskDraft> } | { valid: false; message: string } {
  const title = typeof draft.title === 'string' ? draft.title.trim() : ''
  const description = typeof draft.description === 'string' ? draft.description : ''
  const status = draft.status ?? 'todo'
  const priority = draft.priority ?? 'medium'

  if (title.length < 1 || title.length > 100) return { valid: false, message: '标题长度必须在 1 到 100 个字符之间。' }
  if (description.length > 1000) return { valid: false, message: '描述不能超过 1000 个字符。' }
  if (!isTaskStatus(status)) return { valid: false, message: '任务状态无效。' }
  if (!isTaskPriority(priority)) return { valid: false, message: '任务优先级无效。' }

  return { valid: true, value: { title, description, status, priority } }
}
