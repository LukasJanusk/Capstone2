import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { traitRepository } from '@server/repositories/traitRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import { genreRepository } from '@server/repositories/genreRepository'
import { TRPCError } from '@trpc/server'
import { generatePrompt } from '@server/promt'
import { parseGenre } from '@server/entities/genre'
import { songRepository } from '@server/repositories/songRepository'
import { webhookProcedure } from '@server/trpc/webhookProcedure'
import type { Activity } from '@server/database'
import type { Insertable } from 'kysely'
import { parseActivity } from '../../entities/activity'
import { parseTrait } from '../../entities/traits'
import { transformActivityFromStrava, webhookSchema } from './services/schema'
import getStravaUserTokens from './utils/getStravaUserTokens'

// TODO: (this would be necessary to get approved by strava for publishing full app)
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
        'POST strava.webhooks received new webhook from Strava'
      )
      const tokens = await getStravaUserTokens(
        stravaUserId,
        ctx.stravaService,
        ctx.repos.userRepository
      )
      const activityData = await ctx.stravaService.getActivityById(
        input.object_id,
        tokens.accessToken
      )
      if (!activityData) {
        ctx.logger.error(
          { activityId: input.object_id },
          'POST strava.webhooks failed to fetch activity from Strava'
        )
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Activity not found',
        })
      }
      const activityToStore: Insertable<Activity> = {
        userId: tokens.userId,
        ...transformActivityFromStrava(activityData),
      }
      ctx.logger.info(
        activityToStore,
        'POST strava.webhooks activity parsed for storing'
      )
      try {
        const activityStored =
          await ctx.repos.activityRepository.create(activityToStore)
        ctx.logger.info(
          activityStored,
          'POST strava.webhooks activity saved to db'
        )

        const genres = (await ctx.repos.genreRepository.getAll()).map((g) =>
          parseGenre(g)
        )
        const traits = (
          await ctx.repos.traitRepository.getUserTraitsFull(tokens.userId)
        ).map((t) => parseTrait(t))
        const prompt = generatePrompt(
          parseActivity(activityStored),
          traits,
          genres
        )
        ctx.logger.info(
          prompt,
          'POST strava.webhooks prompt generated successfully'
        )
        const task = await ctx.songGenerationService.requestSong({
          prompt: prompt.prompt,
          logger: ctx.logger,
        })
        if (task.code !== 200 || !task.data) {
          ctx.logger.error(
            task,
            'POST strava.webhooks External API failed create Song genration task'
          )
          return { status: 'EVENT_RECEIVED' }
        }
        const generationTask =
          await ctx.repos.songRepository.createGenerationTask({
            userId: tokens.userId,
            taskId: task.data.taskId,
            activityId: activityStored.id,
          })
        ctx.logger.info(
          generationTask,
          'POST strava.webhooks Song generation task created'
        )
      } catch (err) {
        ctx.logger.error(err, 'POST strava.webhooks error occured:')
        return { status: 'EVENT_RECEIVED' }
      }
    }

    return { status: 'EVENT_RECEIVED' }
  })
