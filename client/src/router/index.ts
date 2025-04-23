import AuthenticatedView from '@/views/AuthenticatedView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaybackView from '@/views/PlaybackView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { errorMessage, resetError, setError } from '@/errors'
import { authUserId } from '@/user'

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

      component: PlaybackView,
    },
    { path: '/dashboard', name: 'Dashboard', component: DashboardView },
    { path: '/signup', name: 'SignUp', component: SignupView },
    { path: '/signin', name: 'SignIn', component: SigninView },
    { path: '/welcome', name: 'Welcome', component: WelcomeView },
    {
      path: '/:pathMatch(.*)*',
      redirect: authUserId.value ? '/' : '/signin',
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (errorMessage.value !== 'Unauthorized, please login') {
    resetError()
  }
  const protectedRoutes = ['Dashboard', 'Authenticated', 'Playback']

  if (protectedRoutes.includes(to.name as string) && !authUserId.value) {
    setError('Unauthorized, please login')
    return next({ name: 'SignIn' })
  }

  next()
})
export default router
