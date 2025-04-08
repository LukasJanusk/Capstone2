import AuthenticatedView from '@/views/AuthenticatedView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaybackView from '@/views/PlaybackView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { resetError } from '@/errors'

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
    { path: '/dashboard', name: 'Dashboard', component: DashboardView },
    { path: '/signup', name: 'SignUp', component: SignupView },
    { path: '/signin', name: 'SignIn', component: SigninView },
    { path: '/welcome', name: 'Welcome', component: WelcomeView },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
router.beforeEach((to, from, next) => {
  resetError()
  next()
})
export default router
