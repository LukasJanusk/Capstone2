export class StravaUser {
  constructor(
    public clientId: number | null = null,
    public accessToken: string | null = null,
    public refreshToken: string | null = null,
    public clientSecret: string | null = null,
    public code: string | null = null
  ) {}

  async getAthlete() {
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      method: 'GET',
    })
    const toJson = await response.json()
    return toJson
  }
  async authenticate(redirectUri = 'http://localhost:5173/authenticated') {
    const response = await fetch(
      `http://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read_all`,
      {
        method: 'GET',
      }
    )
    const toJson = await response.json()
    console.log(toJson)
    return toJson
  }
}
