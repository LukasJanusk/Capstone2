import AuthenticatedView from '@/views/AuthenticatedView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaybackView from '@/views/PlaybackView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { setError } from '@/errors'
import { authUserId } from '@/user'
import AboutView from '@/views/AboutView.vue'

const authenticate = () => {
  if (!authUserId.value) {
    setError('Unauthorized, please login')
    router.push({ name: 'Sign In' })
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    { path: '/about', name: 'About', component: AboutView },
    {
      path: '/authenticated',
      name: 'Authenticated',
      beforeEnter: authenticate,
      component: AuthenticatedView,
    },
    {
      path: '/playback/:activityId',
      name: 'Playback',
      props: (route) => ({
        activityId: parseInt(
          Array.isArray(route.params.activityId)
            ? route.params.activityId[0]
            : route.params.activityId,
          10
        ),
      }),
      beforeEnter: authenticate,

      component: PlaybackView,
    },
    { path: '/dashboard', name: 'Dashboard', beforeEnter: authenticate, component: DashboardView },
    { path: '/signup', name: 'Sign Up', component: SignupView },
    { path: '/signin', name: 'Sign In', component: SigninView },
    { path: '/welcome', name: 'Welcome', component: WelcomeView },
    {
      path: '/:pathMatch(.*)*',
      redirect: authUserId.value ? '/' : '/signin',
    },
  ],
})

export default router
