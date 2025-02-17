import z from 'zod'
import config from '@server/config'
import { publicProcedure } from '../../trpc'

export default publicProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ input }) => {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: config.stravaClientId,
        client_secret: config.stravaClientSecret,
        code: input.code,
        grant_type: 'authorization_code',
      }),
    })
    const data = await response.json()
    // parse data

    const accessToken = data.access_token
    console.log(`Access token: ${accessToken}`)
    // const refreshToken data.refresh_token
    // return only neccessary data for front end.
    return { accessToken }
  })
