import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import { fakeActivity } from '@server/entities/tests/fakes'
import config from '@server/config'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ songRepository, activityRepository }))
  .mutation(async ({ ctx }) => {
    if (config.env !== 'development' && config.env !== 'test')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'not allowed in non dev/test environment',
      })
    const activity = await ctx.repos.activityRepository.create(
      fakeActivity({ userId: ctx.authUser.id, title: 'Test activity' })
    )
    const generationTask = await ctx.repos.songRepository.createGenerationTask({
      taskId: 'fakeTaskId',
      userId: ctx.authUser.id,
      activityId: activity.id,
    })
    const song1 = await ctx.repos.songRepository.createSong({
      userId: ctx.authUser.id,
      activityId: activity.id,
      taskId: generationTask.id,
      audioUrl:
        'https://apiboxfiles.erweima.ai/MWYyNTNmYzItZmNlMC00ZjQ1LThkMWQtNmE5Yjg2YTNiYzQw.mp3',
      originId: 'test',
      title: 'First song',
    })
    const song2 = await ctx.repos.songRepository.createSong({
      userId: ctx.authUser.id,
      activityId: activity.id,
      taskId: generationTask.id,
      audioUrl:
        'https://apiboxfiles.erweima.ai/MWYyNTNmYzItZmNlMC00ZjQ1LThkMWQtNmE5Yjg2YTNiYzQw.mp3',
      originId: 'test',
      title: 'Second song',
    })
    if (activity && song1 && song2) {
      ctx.logger.info(
        'POST test.createActivities - Activity with songs created'
      )
      return { activityId: activity.id }
    }
    ctx.logger.info(
      'POST test.createActivities - Activity with songs not created'
    )
    return { created: false }
  })
