import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'
import { plugin as vueTransitionsPlugin } from '@morev/vue-transitions'
import '@morev/vue-transitions/styles'

const app = createApp(App)
app.use(router)
app.use(ui)
app.use(vueTransitionsPlugin({}))
app.mount('#app')
