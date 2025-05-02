import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import { fakeStravaTokens } from '../../entities/tests/fakes'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .mutation(async ({ ctx }) => {
    if (config.env !== 'development' && config.env !== 'test')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in non dev/test environment',
      })
    const fakeTokens = await ctx.repos.userRepository.storeTokens(
      fakeStravaTokens({ userId: ctx.authUser.id })
    )
    ctx.logger.info(fakeTokens, 'POST test.createTokens - Fake tokens created')
    return fakeTokens
  })
