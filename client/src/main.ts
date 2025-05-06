import { createApp } from 'vue'
// import './style.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'

const app = createApp(App)
app.use(router)
app.use(ui)
app.mount('#app')
