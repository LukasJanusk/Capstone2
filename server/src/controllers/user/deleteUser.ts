import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ email: z.string().email() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const deleted = await ctx.repos.userRepository.deleteUserByEmail(
        input.email
      )
      if (!deleted) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }
      ctx.logger.info(deleted, 'POST user.deleteUser - User deleted')
      return deleted
    } catch (err) {
      ctx.logger.error(
        err,
        'POST user.deleteUser - Error occured deleting user'
      )
      return err
    }
  })
