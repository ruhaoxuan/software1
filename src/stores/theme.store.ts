import { ref } from 'vue'
import { defineStore } from 'pinia'
import { THEME_STORAGE_KEY } from '../constants/task.constants'
import type { ThemePreference } from '../domain/task.types'

function systemPreference(): ThemePreference {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(preference: ThemePreference): void {
  document.documentElement.classList.toggle('dark', preference === 'dark')
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>('light')

  function initialize(): void {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    preference.value = saved === 'dark' || saved === 'light' ? saved : systemPreference()
    applyTheme(preference.value)
  }

  function toggleTheme(): void {
    preference.value = preference.value === 'dark' ? 'light' : 'dark'
    applyTheme(preference.value)
    try { window.localStorage.setItem(THEME_STORAGE_KEY, preference.value) } catch { /* Theme remains usable in memory. */ }
  }

  return { preference, initialize, toggleTheme }
})
