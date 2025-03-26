import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .query(async ({ ctx }) => {
    try {
      const tokens = await ctx.repos.userRepository.getTokens(ctx.authUser.id)
      const athlete = await ctx.stravaService.getUser(tokens.accessToken)
      return {
        id: ctx.authUser.id,
        stravaName: athlete.firstname,
        stravaLastName: athlete.lastname,
      }
    } catch (error) {
      ctx.logger.error(
        error,
        'GET strava.getAthlete failed to access athlete data'
      )
      throw error
    }
  })
