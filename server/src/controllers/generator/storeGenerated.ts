import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { webhookProcedure } from '@server/trpc/webhookProcedure'
import { parseSong } from '@server/entities/song'
import { callbackSchema } from './schema'

export default webhookProcedure
  .use(provideRepos({ songRepository }))
  .input(callbackSchema)
  .mutation(async ({ input, ctx }) => {
    const taskId = input.data.task_id
    const { userId } = await ctx.repos.songRepository.getByTaskId(taskId)
    if (input.data.callbackType === 'text') {
      ctx.logger.info(
        { userId, taskId },
        'POST generator.StoreGenerated text generated'
      )
    }
    if (input.data.callbackType === 'text') {
      ctx.logger.info(
        { userId, taskId },
        'POST generator.StoreGenerated first song generated'
      )
    }
    if (input.data.callbackType === 'complete') {
      ctx.logger.info(
        { userId, taskId },
        'POST generator.StoreGenerated song generated for task'
      )
      const task = await ctx.repos.songRepository.getByTaskId(
        input.data.task_id
      )
      const songs = input.data.data.map((s) =>
        parseSong({
          userId,
          activityId: task.activityId,
          taskId: task.id,
          ...s,
        })
      )
      const stored = await ctx.repos.songRepository.createSong(songs)
      stored.forEach((s) =>
        ctx.logger.info(
          { songId: s.id },
          'POST generator.storeGenerated song stored to DB'
        )
      )
    }
    return {
      code: 200,
      msg: 'Callback received successfully',
    }
  })
