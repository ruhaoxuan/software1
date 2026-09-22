<script setup lang="ts">
export interface Toast { id: number; message: string; type: 'success' | 'error' }
defineProps<{ toasts: Toast[] }>()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2" aria-label="通知">
    <p
      v-for="toast in toasts"
      :key="toast.id"
      class="max-w-md rounded-lg px-4 py-3 text-sm font-medium shadow-lg"
      :class="toast.type === 'error' ? 'bg-red-700 text-white' : 'bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950'"
      :role="toast.type === 'error' ? 'alert' : 'status'"
    >{{ toast.message }}</p>
  </div>
</template>
