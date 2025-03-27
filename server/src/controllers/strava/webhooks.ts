import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { traitRepository } from '@server/repositories/traitRepository'
import { publicProcedure } from '../../trpc'
import { webhookSchema } from './services/schema'
import { isExpired } from './services/tests/utils/isExipred'

export default publicProcedure
  .use(provideRepos({ userRepository, traitRepository }))
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
        // TODO: get user traits from db
        // TODO: Pass user trait data and workout data to process promt. Might need to send request to one of other routers to handle AI api logic
        // WE Will process data and use our formula to set values for prompt based on user traits and activity data

        // eslint-disable-next-line no-console
        console.log(activityData)
      }
      // TODO: handle errors if something went wrong getting request
      return { status: 'EVENT_RECEIVED' }
    }
    return { status: 'Unknown request method' }
  })
