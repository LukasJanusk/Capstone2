import z from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const data = await ctx.stravaService!.getUserTokens(input.code)
    const tokensData = {
      userId: ctx.authUser.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }

    const savedTokens = await ctx.repos.userRepository.storeTokens(tokensData)

    // returns object of user id
    return { id: savedTokens.userId }
  })
