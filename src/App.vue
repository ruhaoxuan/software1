<script setup lang="ts">
import { onMounted, ref } from 'vue'
import KanbanBoard from './components/board/KanbanBoard.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
import ThemeToggle from './components/common/ThemeToggle.vue'
import ToastRegion, { type Toast } from './components/common/ToastRegion.vue'
import TaskFormModal from './components/task/TaskFormModal.vue'
import type { Task, TaskDraft } from './domain/task.types'
import { useTaskStore } from './stores/task.store'

const taskStore = useTaskStore()
const formOpen = ref(false)
const editingTask = ref<Task | null>(null)
const deletingTask = ref<Task | null>(null)
const toasts = ref<Toast[]>([])
let toastId = 0

onMounted(() => {
  taskStore.initialize()
  if (taskStore.storageError) notify(taskStore.storageError, 'error')
})

function notify(message: string, type: Toast['type']): void {
  const toast: Toast = { id: ++toastId, message, type }
  toasts.value.push(toast)
  window.setTimeout(() => { toasts.value = toasts.value.filter((item) => item.id !== toast.id) }, 4200)
}

function openCreate(): void { editingTask.value = null; formOpen.value = true }
function openEdit(task: Task): void { editingTask.value = task; formOpen.value = true }
function closeForm(): void { formOpen.value = false; editingTask.value = null }

function submitForm(draft: TaskDraft): void {
  const result = editingTask.value ? taskStore.updateTask(editingTask.value.id, draft) : taskStore.createTask(draft)
  if (!result.ok) { notify(result.message, 'error'); return }
  notify(editingTask.value ? '任务已保存。' : '任务已创建。', 'success')
  closeForm()
}

function confirmDelete(): void {
  if (!deletingTask.value) return
  const result = taskStore.deleteTask(deletingTask.value.id)
  deletingTask.value = null
  notify(result.ok ? '任务已删除。' : result.message, result.ok ? 'success' : 'error')
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><p class="text-sm font-semibold tracking-wide text-teal-700 dark:text-teal-400">TASK MANAGER</p><h1 class="mt-1 text-3xl font-bold tracking-tight">我的任务看板</h1><p class="mt-2 text-sm text-slate-600 dark:text-slate-400">拖动卡片切换状态，所有内容仅保存在当前浏览器。</p></div>
        <div class="flex items-center gap-3"><ThemeToggle /><button type="button" class="btn-primary" @click="openCreate">＋ 新建任务</button></div>
      </header>
      <div class="overflow-x-auto pb-3"><KanbanBoard @edit="openEdit" @delete="deletingTask = $event" @notify="notify" /></div>
    </div>
    <TaskFormModal :open="formOpen" :initial-task="editingTask" @close="closeForm" @submit="submitForm" />
    <ConfirmDialog :open="Boolean(deletingTask)" title="删除这个任务？" :message="`“${deletingTask?.title ?? ''}”将被永久删除，无法恢复。`" @cancel="deletingTask = null" @confirm="confirmDelete" />
    <ToastRegion :toasts="toasts" />
  </main>
</template>
