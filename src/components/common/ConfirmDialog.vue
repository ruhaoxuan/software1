<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ open: boolean; title: string; message: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const cancelButton = ref<HTMLButtonElement | null>(null)

watch(() => props.open, async (open) => { if (open) { await nextTick(); cancelButton.value?.focus() } })
function onKeydown(event: KeyboardEvent): void { if (event.key === 'Escape') emit('cancel') }
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4" @keydown="onKeydown">
    <section role="alertdialog" aria-modal="true" :aria-label="title" class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button ref="cancelButton" type="button" class="btn-secondary" @click="emit('cancel')">取消</button>
        <button type="button" class="btn-danger" @click="emit('confirm')">删除任务</button>
      </div>
    </section>
  </div>
</template>
