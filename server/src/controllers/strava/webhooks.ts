import z from 'zod'
import config from '@server/config'
import { publicProcedure } from '../../trpc'
import StravaModel from './model'

export default publicProcedure
  .input(
    z.union([
      z.object({
        'hub.mode': z.string().optional(),
        'hub.verify_token': z.string(),
        'hub.challenge': z.string(),
      }),
      z.any(),
    ])
  )
  .mutation(async ({ input, ctx }) => {
    // eslint-disable-next-line no-console
    console.log('Request received')
    if (ctx.req?.method === 'GET') {
      // eslint-disable-next-line no-console
      console.log('Get method received')
      const {
        'hub.mode': mode,
        'hub.verify_token': token,
        'hub.challenge': challenge,
      } = ctx.req.query

      if (mode === 'subscribe' && token === config.stravaSubscribtionKey) {
        // eslint-disable-next-line no-console
        console.log('WEBHOOK_VERIFIED')
        ctx.res?.setHeader('Content-Type', 'application/json')
        ctx.res?.status(200).json({ 'hub.challenge': challenge })
        return null
      }
      throw new Error('Forbidden')
    } else if (ctx.req?.method === 'POST') {
      // eslint-disable-next-line no-console
      // TODO: Process the webhook payload (e.g., save to DB)
      // parse webhook input data
      // if "object_type": "activity" get activity data
      // if "object_type": "athlete" update or delete
      console.log('Webhook received:')
      console.log(input)
      // get access token from db
      if (input.aspect_type === 'create' && input.object_type === 'activity') {
        const activityData = await StravaModel.getActivityById(
          input.object_id,
          'f4a9609543dc2f282b4f5e8b18bbfb14f7f65e74'
        )
        console.log(activityData)
      }
      return { status: 'EVENT_RECEIVED' }
    }
    return { status: 'Unknown request method' }
  })
