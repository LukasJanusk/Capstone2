import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSigninSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
// import { jsonwebtoken } from 'jsonwebtoken'

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(userSigninSchema)
  .mutation(async ({ input: { email, password }, ctx }) => {
    try {
      const user = await ctx.repos.userRepository.findByEmail(email)
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email not found',
      })
    }

    return { accessToken: 'token' }
  })
