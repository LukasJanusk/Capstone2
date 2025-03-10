import { computed, ref } from 'vue'
import type { UserSignup, UserSignin, AuthUser } from '@server/shared/trpc'
import { trpc } from '@/trpc'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '@/utils/auth'

export const authUser = ref<null | AuthUser>(null)

const authToken = ref<string | null>(getStoredAccessToken(localStorage))

export const authUserId = computed(() =>
  authToken.value ? getUserIdFromToken(authToken.value) : null
)
export const isLoggedIn = computed(() => !!authToken.value)

export const signup = async (data: UserSignup) => {
  const user = await trpc.user.signup.mutate(data)
  return user
}
export const signin = async (data: UserSignin) => {
  const { accessToken } = await trpc.user.login.mutate(data)
  storeAccessToken(localStorage, accessToken)
  authToken.value = accessToken
}
export function logout() {
  authToken.value = null
  clearStoredAccessToken(localStorage)
}
