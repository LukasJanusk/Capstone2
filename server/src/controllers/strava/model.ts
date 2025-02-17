import config from '@server/config'

export default class StravaModel {
  client_id: string

  client_secret: string

  constructor() {
    this.client_id = config.stravaClientId
    this.client_secret = config.stravaClientSecret
  }

  // one time code is received from client
  static async getUserTokens(oneTimeCode: string) {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: config.stravaClientId,
        client_secret: config.stravaClientSecret,
        code: oneTimeCode,
        grant_type: 'authorization_code',
      }),
    })
    const data = await response.json()
    // parse data
    // return data to be stored in db
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      athlete: { id: data.athlete.id },
    }
  }

  refreshUserAccessToken() {}

  static async getUser(userAccessToken: string) {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${userAccessToken}` },
        method: 'GET',
      })
      const data = await response.json()
      // parse data
      return data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      return null
    }
  }

  static async getActivityById(activityId: string, userAccessToken: string) {
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

      const activityData = await response.json()
      return activityData
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      return null
    }
  }
}
