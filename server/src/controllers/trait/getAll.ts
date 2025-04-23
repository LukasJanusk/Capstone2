import { traitRepository } from '@server/repositories/traitRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'

export default publicProcedure
  .use(provideRepos({ traitRepository }))
  .query(async ({ ctx }) => {
    const traits = await ctx.repos.traitRepository.getAllPublic()
    return traits
  })
