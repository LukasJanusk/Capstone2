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
      style: z.string().min(1).max(1000),
      title: z.string().min(1).max(100),
      activityId: z.number().int().positive(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const task = await ctx.songGenerationService.requestSong(
      input.title,
      input.style,
      input.prompt
    )

    if (task.code !== 200 || !task.data)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'External API failed to generate task',
      })

    const songGenerationTask =
      await ctx.repos.songRepository.createGenerationTask({
        userId: ctx.authUser.id,
        taskId: task.data.task_id,
        activityId: input.activityId,
      })

    return songGenerationTask
  })
