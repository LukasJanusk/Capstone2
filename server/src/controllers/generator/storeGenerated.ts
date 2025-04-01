import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'

import { publicProcedure } from '@server/trpc'
import { callbackSchema } from './schema'

export default publicProcedure
  .use(provideRepos({ songRepository }))
  .input(callbackSchema)
  .mutation(async ({ input, ctx }) => {
    const taskId = input.data.task_id
    const { userId } = await ctx.repos.songRepository.getByTaskId(taskId)
    const songs = input.data.data.map((s) => ({ userId, ...s }))
    console.log(songs)
    // const stored = ctx.repos.songRepository.createSongs(songs)
  })
