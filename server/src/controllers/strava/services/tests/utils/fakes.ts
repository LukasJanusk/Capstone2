import { random } from '@server/tests/utils/random'
import type {
  StravaActivity,
  StravaAthlete,
  TokensSchema,
  Webhook,
} from '../../schema'

export const fakeStravaAthlete = {
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

export const stravaActivityResponse = <T extends Partial<StravaActivity>>(
  overrides: T = {} as T
) =>
  ({
    id: random.integer({ min: 1, max: 100000 }),
    athlete: {
      id: random.integer({ min: 1, max: 999 }),
      first_name: random.name(),
      last_name: random.last(),
    },
    name: random.name(),
    distance: random.integer({ min: 1, max: 99999 }),
    moving_time: random.integer({ min: 1, max: 99999 }),
    elapsed_time: random.integer({ min: 1, max: 99999 }),
    total_elevation_gain: random.integer({ min: 1, max: 99999 }),
    type: random.pickone([
      'ride',
      'run',
      'workout',
      'walk',
      'mountain_bike',
      'bike',
    ]), // might need to update here
    sport_type: random.string(),
    start_date: '2018-02-16T06:52:54Z',
    start_date_local: '2018-02-16T06:52:54Z',
    average_speed: random.integer({ min: 1, max: 99999 }),
    max_speed: random.integer({ min: 1, max: 99999 }),
    average_cadence: random.integer({ min: 1, max: 99999 }),
    average_temp: random.integer({ min: 1, max: 99999 }),
    average_watts: random.integer({ min: 1, max: 99999 }),
    weighted_average_watts: random.integer({ min: 1, max: 99999 }),
    kilojoules: random.integer({ min: 1, max: 99999 }),
    device_watts: random.bool(),
    has_heartrate: random.bool(),
    max_watts: random.integer({ min: 1, max: 99999 }),
    elev_high: random.integer({ min: 1, max: 99999 }),
    elev_low: random.integer({ min: 1, max: 99999 }),
    calories: random.integer({ min: 1, max: 99999 }),
    ...overrides,
  }) satisfies StravaActivity

export const mockActivityResponse = <T extends Partial<StravaAthlete>>(
  overrides: T = {} as T
) =>
  Promise.resolve(
    new Response(JSON.stringify({ ...stravaActivityResponse, ...overrides }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )

export const fakeWebhook = <T extends Partial<Webhook>>(
  overrides: T = {} as T
): Webhook & T =>
  ({
    aspect_type: 'create',
    event_time: random.integer({ min: 1, max: 100000 }),
    object_id: random.integer({ min: 1, max: 100000 }),
    object_type: 'activity',
    owner_id: random.integer({ min: 1, max: 10000 }),
    subscription_id: random.integer({ min: 1, max: 10000 }),
    ...overrides,
  }) satisfies Webhook
