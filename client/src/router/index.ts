import AuthenticatedView from '@/views/AuthenticatedView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaybackView from '@/views/PlaybackView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'

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
      component: AuthenticatedView,
    },
    {
      path: '/playback',
      name: 'Playback',
      component: PlaybackView,
    },
    { path: '/signup', name: 'SignUp', component: SignupView },
    { path: '/signin', name: 'SignIn', component: SigninView },
    { path: '/welcome', name: 'Welcome', component: WelcomeView },
  ],
})

export default router
