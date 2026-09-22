import { ref } from 'vue'
import type { TaskStatus } from '../domain/task.types'

export function useDragAndDrop(move: (id: string, status: TaskStatus) => void) {
  const draggingId = ref<string | null>(null)
  const activeColumn = ref<TaskStatus | null>(null)

  function start(id: string, event: DragEvent): void {
    draggingId.value = id
    event.dataTransfer?.setData('text/plain', id)
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  function over(status: TaskStatus, event: DragEvent): void {
    event.preventDefault()
    activeColumn.value = status
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  }

  function leave(status: TaskStatus): void {
    if (activeColumn.value === status) activeColumn.value = null
  }

  function drop(status: TaskStatus, event: DragEvent): void {
    event.preventDefault()
    const id = event.dataTransfer?.getData('text/plain') || draggingId.value
    if (id) move(id, status)
    end()
  }

  function end(): void { draggingId.value = null; activeColumn.value = null }
  return { draggingId, activeColumn, start, over, leave, drop, end }
}
