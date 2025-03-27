import z from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const data = await ctx.stravaService.getUserTokens(input.code)
      const tokensData = {
        userId: ctx.authUser.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        stravaUserId: data.athlete.id,
        expiresAt: data.expires_at,
      }

      await ctx.repos.userRepository.storeTokens(tokensData)
      const publicUser = await ctx.repos.userRepository.getUserPublic(
        ctx.authUser.id
      )
      ctx.logger.info(
        { id: ctx.authUser.id },
        'User access to strava granted, tokens stored successfuly'
      )

      return publicUser
    } catch (error) {
      ctx.logger.error(error, 'Error trying to authorize strava user')
      throw error
    }
  })
