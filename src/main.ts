import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useThemeStore } from './stores/theme.store'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
useThemeStore(pinia).initialize()
app.mount('#app')
