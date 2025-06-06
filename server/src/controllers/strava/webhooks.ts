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
        { activityId: input.object_id, aspectType: input.aspect_type },
        'POST strava.webhooks - Received new webhook from Strava'
      )
      try {
        const exist = await ctx.repos.activityRepository.getActivityByOriginId(
          String(input.object_id)
        )
        if (exist) {
          ctx.logger.info(
            { activityId: exist.id },
            'POST strava.webhooks - Activity already exist'
          )
          return { status: 'EVENT_RECEIVED' }
        }
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
            'POST strava.webhooks - Failed to fetch activity from Strava'
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
          'POST strava.webhooks - Activity parsed for storing'
        )

        const activityStored =
          await ctx.repos.activityRepository.create(activityToStore)
        ctx.logger.info(
          activityStored,
          'POST strava.webhooks - Activity saved to db'
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
          'POST strava.webhooks - Prompt generated successfully'
        )
        const task = await ctx.songGenerationService.requestSong({
          prompt: prompt.prompt,
          logger: ctx.logger,
        })
        if (task.code !== 200 || !task.data) {
          ctx.logger.error(
            task,
            'POST strava.webhooks - External API failed create Song genration task'
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
          'POST strava.webhooks - Song generation task created'
        )
      } catch (err) {
        ctx.logger.error(err, 'POST strava.webhooks - Error occured:')
        if (err instanceof TRPCError && err.message === 'Activity not found')
          throw err
        return { status: 'EVENT_RECEIVED' }
      }
    }

    return { status: 'EVENT_RECEIVED' }
  })
