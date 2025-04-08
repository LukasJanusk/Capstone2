import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { webhookProcedure } from '@server/trpc/webhookProcedure'
import { callbackSchema } from './schema'

export default webhookProcedure
  .use(provideRepos({ songRepository }))
  .input(callbackSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.code !== 200) {
      return {
        code: 400,
        msg: 'Bad request',
      }
    }
    const { taskId } = input.data
    const task = await ctx.repos.songRepository.getByTaskId(taskId)
    if (input.data.callbackType === 'text') {
      ctx.logger.info(
        { userId: task.userId, taskId },
        'POST generator.StoreGenerated text generated'
      )
    }
    if (input.data.callbackType === 'first') {
      ctx.logger.info(
        { userId: task.userId, taskId },
        'POST generator.StoreGenerated first song generated'
      )
    }
    if (input.data.callbackType === 'complete') {
      ctx.logger.info(
        { userId: task.userId, taskId },
        'POST generator.StoreGenerated song generated for task'
      )
      if (input.data.data) {
        const songs = input.data.data.map((s) => ({
          userId: task.userId,
          activityId: task.activityId,
          taskId: task.id,
          ...s,
        }))
        const stored = await ctx.repos.songRepository.createSong(songs)
        stored.forEach((s) =>
          ctx.logger.info(
            { songId: s.id },
            'POST generator.storeGenerated song stored to DB'
          )
        )
      }
    }
    return {
      code: 200,
      msg: 'Callback received successfully',
    }
  })
