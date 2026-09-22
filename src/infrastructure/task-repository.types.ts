import type { Task } from '../domain/task.types'

export interface TaskRepository {
  load(): Task[]
  save(tasks: Task[]): void
  clear(): void
}
