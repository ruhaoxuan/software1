<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../constants/task.constants'
import type { Task, TaskDraft } from '../../domain/task.types'
import { validateTaskDraft } from '../../domain/task.validation'

const props = defineProps<{ open: boolean; initialTask?: Task | null }>()
const emit = defineEmits<{ submit: [draft: TaskDraft]; close: [] }>()
const titleInput = ref<HTMLInputElement | null>(null)
const fieldError = ref('')
const form = reactive<Required<TaskDraft>>({ title: '', description: '', status: 'todo', priority: 'medium' })
const editing = () => Boolean(props.initialTask)

function reset(): void {
  form.title = props.initialTask?.title ?? ''
  form.description = props.initialTask?.description ?? ''
  form.status = props.initialTask?.status ?? 'todo'
  form.priority = props.initialTask?.priority ?? 'medium'
  fieldError.value = ''
}
watch(() => props.open, async (open) => { if (open) { reset(); await nextTick(); titleInput.value?.focus() } })

function submit(): void {
  const checked = validateTaskDraft(form)
  if (!checked.valid) { fieldError.value = checked.message; titleInput.value?.focus(); return }
  fieldError.value = ''
  emit('submit', { ...checked.value })
}
function onKeydown(event: KeyboardEvent): void { if (event.key === 'Escape') emit('close') }
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/50 p-4" @keydown="onKeydown">
    <section role="dialog" aria-modal="true" :aria-label="editing() ? '编辑任务' : '新建任务'" class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
      <div class="flex items-center justify-between gap-4"><h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ editing() ? '编辑任务' : '新建任务' }}</h2><button type="button" class="icon-button" aria-label="关闭" @click="emit('close')">×</button></div>
      <form class="mt-5 space-y-4" @submit.prevent="submit">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">标题 <span class="text-red-600">*</span>
          <input ref="titleInput" v-model="form.title" class="form-input mt-1" maxlength="100" required aria-describedby="title-error" />
        </label>
        <p v-if="fieldError" id="title-error" class="text-sm text-red-700 dark:text-red-300">{{ fieldError }}</p>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">描述（选填）
          <textarea v-model="form.description" class="form-input mt-1 min-h-28" maxlength="1000" />
        </label>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">状态
            <select v-model="form.status" class="form-input mt-1"><option v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option></select>
          </label>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">优先级
            <select v-model="form.priority" class="form-input mt-1"><option v-for="option in PRIORITY_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option></select>
          </label>
        </div>
        <div class="flex justify-end gap-3 pt-2"><button type="button" class="btn-secondary" @click="emit('close')">取消</button><button type="submit" class="btn-primary">{{ editing() ? '保存修改' : '创建任务' }}</button></div>
      </form>
    </section>
  </div>
</template>
