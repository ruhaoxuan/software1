<script setup lang="ts">
import { PRIORITY_LABELS, STATUS_OPTIONS } from '../../constants/task.constants'
import type { Task, TaskStatus } from '../../domain/task.types'

defineProps<{ task: Task }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  move: [task: Task, status: TaskStatus]
  dragStart: [task: Task, event: DragEvent]
  dragEnd: []
}>()

const priorityClasses = {
  high: 'bg-red-100 text-red-800 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-800',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800',
  low: 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
}
</script>

<template>
  <article
    draggable="true"
    class="group rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
    @dragstart="emit('dragStart', task, $event)"
    @dragend="emit('dragEnd')"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="break-words text-base font-semibold text-slate-900 dark:text-white">{{ task.title }}</h3>
      <span class="shrink-0 rounded-full px-2 py-1 text-xs font-bold ring-1" :class="priorityClasses[task.priority]">{{ PRIORITY_LABELS[task.priority] }}优先级</span>
    </div>
    <p v-if="task.description" class="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{{ task.description }}</p>
    <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
      <label class="text-xs text-slate-500 dark:text-slate-400">
        <span class="sr-only">移动 {{ task.title }} 到</span>
        <select class="rounded border-slate-300 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white" :value="task.status" @change="emit('move', task, ($event.target as HTMLSelectElement).value as TaskStatus)">
          <option v-for="status in STATUS_OPTIONS" :key="status.value" :value="status.value">移动到{{ status.label }}</option>
        </select>
      </label>
      <div class="flex gap-1">
        <button type="button" class="icon-button" :aria-label="`编辑 ${task.title}`" @click="emit('edit', task)">编辑</button>
        <button type="button" class="icon-button text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950" :aria-label="`删除 ${task.title}`" @click="emit('delete', task)">删除</button>
      </div>
    </div>
  </article>
</template>
