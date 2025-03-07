import { random } from '@server/tests/utils/random'
import type { StravaAthlete, TokensSchema } from '../../schema'

const fakeStravaAthlete = {
  id: random.integer({ min: 1, max: 10 }),
  firstname: random.name(),
  lastname: random.last(),
}

export const fakeStravaAccessTokens = <T extends Partial<TokensSchema>>(
  overrides: T = {} as T
): TokensSchema & T => ({
  token_type: 'Bearer',
  expires_at: random.integer({ min: 1, max: 10 }),
  expires_in: random.integer({ min: 1, max: 10 }),
  refresh_token: random.string(),
  access_token: random.string(),
  athlete: fakeStravaAthlete,
  ...overrides,
})
export const mockStravaResponse = <T extends Partial<TokensSchema>>(
  overrides: T = {} as T
) =>
  Promise.resolve(
    new Response(JSON.stringify(fakeStravaAccessTokens(overrides)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )

export const mockStravaAthleteResponse = <T extends Partial<StravaAthlete>>(
  overrides: T = {} as T
) =>
  Promise.resolve(
    new Response(JSON.stringify({ ...fakeStravaAthlete, ...overrides }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
