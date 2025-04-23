import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .query(async ({ ctx }) => {
    try {
      const stravaTokens = await ctx.repos.userRepository.getTokens(
        ctx.authUser.id
      )
      ctx.logger.info(
        { userId: stravaTokens.userId },
        'GET user.stravaAuthenticated - User is authenticated by Strava'
      )
      return { authenticated: true }
    } catch (err) {
      ctx.logger.info(
        'GET user.stravaAuthenticated - User is not authenticated by Strava'
      )
      return { authenticated: false }
    }
  })
