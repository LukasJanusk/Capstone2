import { TRPCError } from '@trpc/server'
import type { StravaActivity, StravaAthlete, TokensSchema } from '../../schema'
import {
  fakeStravaAccessTokens,
  fakeStravaAthlete,
  stravaActivityResponse,
} from './fakes'

export const createFakeStravaService = (
  client_id: string,
  client_secret: string
) => ({
  getUserTokens(oneTimeCode: string): Promise<TokensSchema> {
    if (
      oneTimeCode !== 'valid_code' ||
      client_id !== 'valid_id' ||
      client_secret !== 'valid_secret'
    )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    return Promise.resolve(fakeStravaAccessTokens())
  },

  async getUser(userAccessToken: string): Promise<StravaAthlete> {
    if (
      userAccessToken !== 'valid_token' ||
      client_id !== 'valid_id' ||
      client_secret !== 'valid_secret'
    )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    return Promise.resolve(fakeStravaAthlete)
  },
  async refreshUserAccessToken(refreshToken: string) {
    if (
      refreshToken !== 'valid_token' ||
      client_id !== 'valid_id' ||
      client_secret !== 'valid_secret'
    )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    return Promise.resolve(fakeStravaAccessTokens())
  },
  async getActivityById(
    activityId: number,
    userAccessToken: string
  ): Promise<StravaActivity> {
    if (
      activityId !== 1 ||
      userAccessToken !== 'valid_token' ||
      client_id !== 'valid_id' ||
      client_secret !== 'valid_secret'
    )
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error accessing Strava servers',
      })
    return Promise.resolve(stravaActivityResponse())
  },
})
