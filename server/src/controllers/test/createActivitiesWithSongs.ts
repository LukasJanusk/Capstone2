import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { songRepository } from '@server/repositories/songRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import { fakeActivity } from '@server/entities/tests/fakes'

export default authenticatedProcedure
  .use(provideRepos({ songRepository, activityRepository }))
  .mutation(async ({ ctx }) => {
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
      return { created: true }
    }
    ctx.logger.info(
      'POST test.createActivities - Activity with songs not created'
    )
    return { created: false }
  })
