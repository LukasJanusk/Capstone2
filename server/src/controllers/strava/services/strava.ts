/* eslint-disable no-console */
import {
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
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )

      throw error
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

      return parseTokenResponse(data)
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      throw error
    }
  },

  async getUser(userAccessToken: string): Promise<StravaAthlete> {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${userAccessToken}` },
        method: 'GET',
      })
      const data = await response.json()

      return parseStravaAthlete(data)
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      throw error
    }
  },

  async getActivityById(
    activityId: string,
    userAccessToken: string
  ): Promise<StravaActivity> {
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
      throw error
    }
  },
})

export type StravaService = ReturnType<typeof createStravaService>
