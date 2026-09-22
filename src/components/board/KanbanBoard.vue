<script setup lang="ts">
import { STATUS_OPTIONS } from '../../constants/task.constants'
import { useDragAndDrop } from '../../composables/useDragAndDrop'
import type { Task, TaskStatus } from '../../domain/task.types'
import { useTaskStore } from '../../stores/task.store'
import KanbanColumn from './KanbanColumn.vue'

const emit = defineEmits<{ edit: [task: Task]; delete: [task: Task]; notify: [message: string, type: 'success' | 'error'] }>()
const taskStore = useTaskStore()
const { activeColumn, start, over, leave, drop, end } = useDragAndDrop((id, status) => move(id, status))

function move(task: Task, status: TaskStatus): void
function move(id: string, status: TaskStatus): void
function move(taskOrId: Task | string, status: TaskStatus): void {
  const id = typeof taskOrId === 'string' ? taskOrId : taskOrId.id
  const result = taskStore.moveTask(id, status)
  if (!result.ok) emit('notify', result.message, 'error')
  else if (typeof taskOrId !== 'string' && taskOrId.status !== status) emit('notify', `任务已移动到${STATUS_OPTIONS.find((item) => item.value === status)?.label ?? ''}。`, 'success')
}
</script>

<template>
  <div class="grid min-w-[860px] grid-cols-3 gap-5 lg:min-w-0">
    <KanbanColumn
      v-for="column in STATUS_OPTIONS"
      :key="column.value"
      :status="column.value"
      :title="column.label"
      :tasks="taskStore.tasksByStatus(column.value)"
      :active="activeColumn === column.value"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
      @move="(task, status) => move(task, status)"
      @drag-start="(task, event) => start(task.id, event)"
      @drag-end="end"
      @drag-over="(status, event) => over(status, event)"
      @drag-leave="leave($event)"
      @drop-task="(status, event) => drop(status, event)"
    />
  </div>
</template>
