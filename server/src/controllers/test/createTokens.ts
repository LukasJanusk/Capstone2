import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { fakeStravaTokens } from '../../entities/tests/fakes'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .mutation(async ({ ctx }) => {
    const fakeTokens = await ctx.repos.userRepository.storeTokens(
      fakeStravaTokens({ userId: ctx.authUser.id })
    )
    ctx.logger.info(fakeTokens, 'POST test.createTokens - Fake tokens created')
    return fakeTokens
  })
