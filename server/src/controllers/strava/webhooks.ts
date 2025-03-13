import { publicProcedure } from '../../trpc'
import { webhookSchema } from './services/schema'

export default publicProcedure
  .input(webhookSchema)
  .mutation(async ({ input, ctx }) => {
    if (ctx.req?.method === 'POST') {
      // TODO: Process the webhook payload (e.g., save to DB)
      // if "object_type": "activity" get activity data
      // if "object_type": "athlete" update or delete
      // get access token from db
      if (input.aspect_type === 'create' && input.object_type === 'activity') {
        const activityData = await ctx.stravaService!.getActivityById(
          input.object_id,
          'f4a9609543dc2f282b4f5e8b18bbfb14f7f65e74' // !!!PLACEHOLDER ---- This will be received from DB
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
