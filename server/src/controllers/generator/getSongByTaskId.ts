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
    const activities =
      await ctx.repos.activityRepository?.getActivitiesByUserId(ctx.authUser.id)
    const newSongs = (
      await Promise.all(
        notGenerated.map(async (t) => {
          const songData = await ctx.songGenerationService.requestSongByTaskId(
            t.taskId
          )
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

    const activitiesWithSongs = notGenerated.map((t) => ({
      activity: activities.find((a) => a.id === t.activityId),
      songs: newSongs.filter((s) => s.taskId === t.id),
    }))
    return activitiesWithSongs.filter((a) => a.activity && a.songs)
  })
