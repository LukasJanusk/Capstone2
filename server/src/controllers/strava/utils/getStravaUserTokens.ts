import type { StravaService } from '@server/controllers/strava/services'
import type { UserRepository } from '@server/repositories/userRepository'
import type { StravaTokensApp } from '@server/entities/tokens'
import { isExpired } from '../services/tests/utils/isExipred'

/**
 * Retrieves and refreshes a Strava user's authentication tokens if expired.
 *
 * @param {number} stravaUserId - The unique ID of the Strava user.
 * @param {StravaService} strava - The Strava service for handling authentication.
 * @param {UserRepository} userRepository - The repository to fetch and store user tokens.
 * @returns {Promise<StravaTokens>} - The latest valid authentication tokens.
 *
 * This function:
 * 1. Fetches the user's stored authentication tokens from `userRepository`.
 * 2. Checks if the access token is expired using `isExpired`.
 * 3. If expired, it refreshes the access token using `StravaService` and updates the stored tokens.
 * 4. Returns the updated tokens.
 */
export default async (
  stravaUserId: number,
  strava: StravaService,
  userRepository: UserRepository
): Promise<StravaTokensApp> => {
  let tokens = await userRepository.getTokensByStravaUserId(stravaUserId)
  if (isExpired(tokens.expiresAt)) {
    const refreshedTokens = await strava.refreshUserAccessToken(
      tokens.refreshToken
    )
    tokens = await userRepository.storeTokens({
      ...tokens,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
    })
  }

  return tokens
}
