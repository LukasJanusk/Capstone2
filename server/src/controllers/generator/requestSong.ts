import z from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(provideRepos({ songRepository }))
  .input(
    z.object({
      prompt: z.string().max(200).min(1),
      lyric: z.string().min(1).max(1000).nullable(),
      title: z.string().min(1).max(100).nullable(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const task = await ctx.songGenerationService.requestSong(
      input.prompt,
      input.lyric ?? undefined,
      input.title ?? undefined
    )

    if (task.code !== 200 || !task.data.task_id)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'External API failed to generate task',
      })

    const songGenerationTask =
      await ctx.repos.songRepository.createGenerationTask({
        userId: ctx.authUser.id,
        taskId: task.data.task_id,
      })

    return songGenerationTask
  })
