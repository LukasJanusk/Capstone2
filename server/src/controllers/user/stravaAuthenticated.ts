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
        'GET user.stravaAuthenticated user is authenticated by Strava'
      )
      return { authenticated: true }
    } catch (err) {
      ctx.logger.info(
        err,
        'GET user.stravaAuthenticated user is not authenticated by Strava'
      )
      return { authenticated: false }
    }
  })
