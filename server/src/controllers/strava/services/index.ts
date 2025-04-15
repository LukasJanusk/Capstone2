import { TRPCError } from '@trpc/server'
import type { Logger } from '@server/logger'
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
  async getUserTokens(
    oneTimeCode: string,
    logger?: Logger
  ): Promise<TokensSchema> {
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
      if (logger)
        logger.error(error, 'Failed to receive user tokens from Strava')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to receive user tokens from Strava',
      })
    }
  },

  async refreshUserAccessToken(refreshToken: string, logger?: Logger) {
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
      if (logger) {
        logger.error(error, 'Failed to refresh user Tokens')
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    }
  },

  async getUser(
    userAccessToken: string,
    logger?: Logger
  ): Promise<StravaAthlete> {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${userAccessToken}` },
        method: 'GET',
      })
      const data = await response.json()
      return parseStravaAthlete(data)
    } catch (error) {
      if (logger) {
        logger.error(error, 'Failed to get user data from Strava')
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    }
  },

  async getActivityById(
    activityId: number,
    userAccessToken: string,
    logger?: Logger
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
      if (logger) {
        logger.error(error, 'Failed to fetch activity')
      }
      return null
    }
  },
})

export type StravaService = ReturnType<typeof createStravaService>
