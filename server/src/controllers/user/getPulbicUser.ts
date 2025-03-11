import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'

import z from 'zod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ id: z.number().positive().int() }))
  .query(async ({ input, ctx }) => {
    if (input.id !== ctx.authUser.id)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Access denied' })
    const userData = await ctx.repos.userRepository.getUserPublic(input.id)

    return userData
  })
