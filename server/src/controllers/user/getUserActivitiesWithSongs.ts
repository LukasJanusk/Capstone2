import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { songRepository } from '@server/repositories/songRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import type { ActivityWithSong } from '@server/entities/activity'
import provideRepos from '../../trpc/provideRepos/index'

export default authenticatedProcedure
  .use(provideRepos({ songRepository, activityRepository }))
  .query(async ({ ctx }) => {
    const songs = await ctx.repos.songRepository.getSongByUserId(
      ctx.authUser.id
    )
    const activities = await ctx.repos.activityRepository.getActivitiesByUserId(
      ctx.authUser.id
    )

    const activitiesWithSongs = activities.map((a) => ({
      activity: a,
      songs: songs.filter((s) => s.activityId === a.id),
    })) as ActivityWithSong[]
    ctx.logger.info(
      {
        userId: ctx.authUser.id,
        activities: activitiesWithSongs.map((a) => a.activity.id),
      },
      'GET user.getUserActivitiesWithSong - Returning user Activities'
    )
    return activitiesWithSongs
  })
