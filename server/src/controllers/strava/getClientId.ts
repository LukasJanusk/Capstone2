import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { publicProcedure } from '@server/trpc'
import config from '@server/config'

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .query(async () => config.stravaClientId)
