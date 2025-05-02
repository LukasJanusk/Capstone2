import type { ActivityWithSong } from '@server/entities/activity'
import { activityRepository } from '@server/repositories/activityRepository'
import { songRepository } from '@server/repositories/songRepository'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ userRepository, songRepository, activityRepository }))
  .mutation(async ({ ctx }) => {
    const songs = await ctx.repos.songRepository.getSongByUserId(
      ctx.authUser.id
    )
    const generationTasks =
      await ctx.repos.songRepository.getGenerationTaskByUserId(ctx.authUser.id)

    const notGenerated = generationTasks.filter(
      (t) => !songs.some((s) => s.taskId === t.id)
    )
    if (notGenerated.length > 0) {
      ctx.logger.info(
        notGenerated,
        'POST generator.getSongByTaskId - Found tasks that did not generate song'
      )
    } else {
      ctx.logger.info(
        { userId: ctx.authUser.id },
        'POST generator.getSongByTaskId - No ungenerated songs found'
      )
      return []
    }
    const activities = await ctx.repos.activityRepository.getActivitiesByUserId(
      ctx.authUser.id
    )
    const newSongs = (
      await Promise.all(
        notGenerated.map(async (t) => {
          const songData = await ctx.songGenerationService.requestSongByTaskId(
            t.taskId,
            ctx.logger
          )
          if (!songData.data.response.sunoData) {
            ctx.logger.info(
              { taskId: t.taskId },
              `POST generator.getSongByTaksId - SUNO API failed to generate song with errorCode: ${songData.data.errorCode}, error message: ${songData.data.errorMessage}`
            )
            return []
          }
          return Promise.all(
            songData.data.response.sunoData.map(async (s) => {
              const song = {
                activityId: t.activityId,
                audioUrl: s.audioUrl,
                imageUrl: s.imageUrl,
                originId: s.id,
                prompt: s.prompt,
                taskId: t.id,
                title: s.title,
                userId: t.userId,
              }
              const newSong = await ctx.repos.songRepository.createSong(song)
              return newSong
            })
          )
        })
      )
    )

      .flat()
      .flat()
    songs.push(...newSongs)
    const activitiesWithSongs = activities.map((a) => ({
      activity: a,
      songs: songs.filter((s) => s.activityId === a.id),
    })) as ActivityWithSong[]
    ctx.logger.info(
      activitiesWithSongs.map((a) => ({ activityId: a.activity.id })),
      'POST generator.getSongByTaskId - Returning activities with songs'
    )
    return activitiesWithSongs
  })
