import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'

import { publicProcedure } from '@server/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { callbackSchema, transformSongCallbackData } from './schema'

export default publicProcedure
  .use(provideRepos({ songRepository }))
  .input(z.any())
  .mutation(async ({ input, ctx }) => {
    try {
      const parsedInput = callbackSchema.safeParse(input)
      if (!parsedInput.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid input: ${JSON.stringify(parsedInput.error.errors)}`,
        })
      }
      const songData = transformSongCallbackData(parsedInput.data.data)
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
