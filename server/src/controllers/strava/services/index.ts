/* eslint-disable no-console */
import { TRPCError } from '@trpc/server'
import {
  parseRefreshTokenResponse,
  parseStravaActivity,
  parseStravaAthlete,
  parseTokenResponse,
  type StravaActivity,
  type StravaAthlete,
  type TokensSchema,
} from './schema'

export const createStravaService = (
  client_id: string,
  client_secret: string
) => ({
  // one time code is received from client
  async getUserTokens(oneTimeCode: string): Promise<TokensSchema> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id,
          client_secret,
          code: oneTimeCode,
          grant_type: 'authorization_code',
        }),
      })
      const data = await response.json()

      return parseTokenResponse(data)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occured'
      console.error(message)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message,
      })
    }
  },

  async refreshUserAccessToken(refreshToken: string) {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id,
          client_secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      })

      const data = await response.json()

      return parseRefreshTokenResponse(data)
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    }
  },

  async getUser(userAccessToken: string): Promise<StravaAthlete> {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${userAccessToken}` },
        method: 'GET',
      })
      const data = await response.json()
      console.log(data)
      return parseStravaAthlete(data)
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    }
  },

  async getActivityById(
    activityId: number,
    userAccessToken: string
  ): Promise<StravaActivity | null> {
    try {
      const response = await fetch(
        `https://www.strava.com/api/v3/activities/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch activity: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()

      return parseStravaActivity(data)
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      return null
    }
  },
})

export type StravaService = ReturnType<typeof createStravaService>
