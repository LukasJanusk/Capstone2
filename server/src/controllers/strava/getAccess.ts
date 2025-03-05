import z from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { publicProcedure } from '../../trpc'

// TODO: make Auth procedure for logged in user
export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // TODO: make mock stravaService
    const data = await ctx.stravaService!.getUserTokens(input.code)
    // take authUser ID
    const tokensData = {
      userId: ctx.AuthUser.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }
    const savedTokens = ctx.repos.userRepository.storeTokens(tokensData)
    // TODO: save tokens to DB

    // return only neccessary data to front-end.
    // should not expose token to front end. Send back username or user id.
    return { accessToken }
  })
