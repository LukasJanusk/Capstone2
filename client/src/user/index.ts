import { ref } from 'vue'
import type { UserPublic, UserSignup, UserSignin, AuthUser } from '@server/shared/trpc'
import { trpc } from '@/trpc'

export const authUser = ref<null | AuthUser>(null)

export const signup = async (data: UserSignup): Promise<AuthUser> => {
  const user = await trpc.user.signup.mutate(data)
  if (user) authUser.value = user
  return user
}
export const signin = async (data: UserSignin): Promise<AuthUser> => {
  const user = await trpc.user.signin.mutate(data)
  return user
}
