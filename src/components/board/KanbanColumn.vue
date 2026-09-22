<script setup lang="ts">
import type { Task, TaskStatus } from '../../domain/task.types'
import TaskCard from '../task/TaskCard.vue'

defineProps<{ status: TaskStatus; title: string; tasks: Task[]; active: boolean }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  move: [task: Task, status: TaskStatus]
  dragStart: [task: Task, event: DragEvent]
  dragEnd: []
  dragOver: [status: TaskStatus, event: DragEvent]
  dragLeave: [status: TaskStatus]
  dropTask: [status: TaskStatus, event: DragEvent]
}>()
</script>

<template>
  <section
    class="min-h-80 rounded-2xl border bg-slate-100/80 p-3 transition-colors dark:bg-slate-900/60"
    :class="active ? 'border-teal-500 ring-2 ring-teal-300 dark:ring-teal-800' : 'border-slate-200 dark:border-slate-700'"
    @dragover="emit('dragOver', status, $event)"
    @dragleave="emit('dragLeave', status)"
    @drop="emit('dropTask', status, $event)"
  >
    <header class="mb-3 flex items-center justify-between px-1">
      <h2 class="font-bold text-slate-800 dark:text-slate-100">{{ title }}</h2>
      <span class="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-200">{{ tasks.length }}</span>
    </header>
    <div class="space-y-3">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @edit="task => emit('edit', task)" @delete="task => emit('delete', task)" @move="(task, nextStatus) => emit('move', task, nextStatus)" @drag-start="(task, event) => emit('dragStart', task, event)" @drag-end="emit('dragEnd')" />
      <div v-if="tasks.length === 0" class="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        {{ active ? '松开鼠标，将任务放到这里' : '暂无任务，可将卡片拖到这里' }}
      </div>
    </div>
  </section>
</template>
