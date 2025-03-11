import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .query(async ({ ctx }) => {
    // TODO: Error handling
    const tokens = await ctx.repos.userRepository.getTokens(ctx.authUser.id)
    const athlete = await ctx.stravaService!.getUser(tokens.accessToken)

    // returns object of user id
    return {
      id: ctx.authUser.id,
      stravaName: athlete.firstname,
      stravaLastName: athlete.lastname,
    }
  })
