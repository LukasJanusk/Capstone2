import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { traitRepository } from '@server/repositories/traitRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import { genreRepository } from '@server/repositories/genreRepository'
import { TRPCError } from '@trpc/server'
import { generatePrompt } from '@server/promt'
import { parseGenre } from '@server/entities/genre'
import config from '@server/config'
import { songRepository } from '@server/repositories/songRepository'
import { webhookProcedure } from '@server/trpc/webhookProcedure'
import { parseActivity } from '../../entities/activity'
import { parseTrait } from '../../entities/traits'
import { transformActivityFromStrava, webhookSchema } from './services/schema'
import { isExpired } from './services/tests/utils/isExipred'

// TODO: Process the webhook payload (e.g., save to DB)
// if "object_type": "activity" get activity data
// if "object_type": "athlete" update or delete

export default webhookProcedure
  .use(
    provideRepos({
      userRepository,
      traitRepository,
      activityRepository,
      genreRepository,
      songRepository,
    })
  )
  .input(webhookSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.aspect_type === 'create' && input.object_type === 'activity') {
      const stravaUserId = input.owner_id
      ctx.logger.info(
        { activityId: input.object_id },
        'POST strava.webhooks received new activity'
      )
      let tokens =
        await ctx.repos.userRepository.getTokensByStravaUserId(stravaUserId)
      if (isExpired(tokens.expiresAt)) {
        const refreshedTokens = await ctx.stravaService.refreshUserAccessToken(
          tokens.refreshToken
        )
        tokens = await ctx.repos.userRepository.storeTokens({
          ...tokens,
          accessToken: refreshedTokens.access_token,
          refreshToken: refreshedTokens.refresh_token,
        })
      }
      const activityData = await ctx.stravaService.getActivityById(
        input.object_id,
        tokens.accessToken
      )
      if (!activityData) {
        ctx.logger.error(
          activityData,
          'POST strava.webhooks failed to fetch activity from strava API'
        )
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Activity not found',
        })
      }
      const transActivity = transformActivityFromStrava(activityData)
      const activityStored = await ctx.repos.activityRepository.create({
        userId: tokens.userId,
        ...transActivity,
      })
      const userTraits = await ctx.repos.traitRepository.getUserTraitsFull(
        tokens.userId
      )
      const genres = (await ctx.repos.genreRepository.getAll()).map((g) =>
        parseGenre(g)
      )
      const traits = userTraits.map((t) => parseTrait(t))
      const prompt = generatePrompt(
        parseActivity(activityStored),
        traits,
        genres
      )
      // eslint-disable-next-line no-console
      console.log(`Generated prompt: ${prompt}`)
      if (config.env === 'production') {
        const task = await ctx.songGenerationService.requestSong(
          prompt.title,
          prompt.style,
          prompt.promt,
          `${config.publicDomain}/api/trpc/generator.storeGenerated`
        )
        if (task.code !== 200 || !task.data)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'External API failed to generate task',
          })
        await ctx.repos.songRepository.createGenerationTask({
          userId: tokens.userId,
          taskId: task.data.task_id,
        })
      }
    }

    // TODO: handle errors if something went wrong getting request

    return { status: 'EVENT_RECEIVED' }
  })
