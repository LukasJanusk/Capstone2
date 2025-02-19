import Authenticated from '@/views/Authenticated.vue'
import HomeView from '@/views/HomeView.vue'
import PlaybackView from '@/views/PlaybackView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/authenticated',
      name: 'Authenticated',
      component: Authenticated,
    },
    {
      path: '/playback',
      name: 'Playback',
      component: PlaybackView,
    },
  ],
})

export default router
