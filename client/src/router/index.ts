import Authenticated from '@/views/Authenticated.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/authenticated',
      name: 'Authenticated',
      component: Authenticated,
    },
  ],
})

export default router
