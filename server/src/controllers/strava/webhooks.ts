import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { traitRepository } from '@server/repositories/traitRepository'
import { activityRepository } from '@server/repositories/activityRepository'
import { TRPCError } from '@trpc/server'
import { publicProcedure } from '../../trpc'
import { transformActivityFromStrava, webhookSchema } from './services/schema'
import { isExpired } from './services/tests/utils/isExipred'

export default publicProcedure
  .use(provideRepos({ userRepository, traitRepository, activityRepository }))
  .input(webhookSchema)
  .mutation(async ({ input, ctx }) => {
    if (ctx.req?.method === 'POST') {
      // TODO: Process the webhook payload (e.g., save to DB)
      // if "object_type": "activity" get activity data
      // if "object_type": "athlete" update or delete

      if (input.aspect_type === 'create' && input.object_type === 'activity') {
        const stravaUserId = input.owner_id
        ctx.logger.info(
          { activityId: input.object_id },
          'POST strava.webhooks received new activity'
        )
        let tokens =
          await ctx.repos.userRepository.getTokensByStravaUserId(stravaUserId)
        if (isExpired(tokens.expiresAt)) {
          const refreshedTokens =
            await ctx.stravaService.refreshUserAccessToken(tokens.refreshToken)
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
        const activityStored = await ctx.repos.activityRepository.create({
          userId: tokens.userId,
          ...transformActivityFromStrava(activityData),
        })
      }
      // get user traits
      // form prompt
      // send reques to music generation api

      // TODO: handle errors if something went wrong getting request

      return { status: 'EVENT_RECEIVED' }
    }
    return { status: 'Unknown request method' }
  })
