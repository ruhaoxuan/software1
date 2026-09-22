<script setup lang="ts">
import { useThemeStore } from '../../stores/theme.store'

const themeStore = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    :aria-label="themeStore.preference === 'dark' ? '切换为浅色模式' : '切换为深色模式'"
    @click="themeStore.toggleTheme()"
  >
    {{ themeStore.preference === 'dark' ? '☀️ 浅色' : '🌙 深色' }}
  </button>
</template>
