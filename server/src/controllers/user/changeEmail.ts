import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import z from 'zod'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .input(
    z.object({
      email: z.string().email().trim().toLowerCase().min(5).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const updated = await ctx.repos.userRepository.updateEmail(
      ctx.authUser.id,
      input
    )

    return updated
  })
