import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { webhookProcedure } from '@server/trpc/webhookProcedure'
import { callbackSchema, transformSongCallbackData } from './schema'

export default webhookProcedure
  .use(provideRepos({ songRepository }))
  .input(callbackSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      if (input.code !== 200) {
        ctx.logger.error(
          input,
          'POST generator.storeGenerated - Bad Request input object:'
        )
        return {
          code: 400,
          msg: 'Bad request',
        }
      }
      const songData = transformSongCallbackData(input.data)
      const { taskId } = songData
      const task = await ctx.repos.songRepository.getByTaskId(taskId)
      if (songData.callbackType === 'text') {
        ctx.logger.info(
          { userId: task.userId, taskId },
          'POST generator.StoreGenerated - Text generated'
        )
      }
      if (songData.callbackType === 'first') {
        ctx.logger.info(
          { userId: task.userId, taskId },
          'POST generator.StoreGenerated - First song generated'
        )
      }
      if (songData.callbackType === 'complete') {
        ctx.logger.info(
          { userId: task.userId, taskId },
          'POST generator.StoreGenerated - Song generated'
        )
        if (songData.data) {
          const songs = songData.data.map((s) => ({
            userId: task.userId,
            activityId: task.activityId,
            taskId: task.id,
            ...s,
          }))
          const stored = await ctx.repos.songRepository.createSong(songs)
          stored.forEach((s) =>
            ctx.logger.info(
              { songId: s.id },
              'POST generator.storeGenerated - Song stored to DB'
            )
          )
        }
      }
      return {
        code: 200,
        msg: 'Callback received successfully',
      }
    } catch (err) {
      ctx.logger.error(err, 'POST generator.storeGenerated - Error occured')
      return {
        code: 400,
        msg: 'Bad request',
      }
    }
  })
