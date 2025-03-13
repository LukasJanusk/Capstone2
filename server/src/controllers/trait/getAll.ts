import { traitRepository } from '@server/repositories/traitRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'

export default publicProcedure
  .use(provideRepos({ traitRepository }))
  .query(async ({ ctx }) => {
    const traits = await ctx.repos.traitRepository.getAllPublic()
    // TODO: add validation for at least 3 traits in db so it does not return an empty array
    return traits
  })
