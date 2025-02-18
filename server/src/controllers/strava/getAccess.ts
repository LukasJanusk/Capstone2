import z from 'zod'
import { publicProcedure } from '../../trpc'

export default publicProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const data = await ctx.stravaService.getUserTokens(input.code)

    const accessToken = data.access_token
    // const refreshToken data.refresh_token
    // TODO: save tokens to DB

    // return only neccessary data to front-end.
    return { accessToken }
  })
