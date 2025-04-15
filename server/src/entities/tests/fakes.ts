import type {
  User,
  Trait,
  Genre,
  StravaTokens,
  Activity,
} from '@server/database'
import { random } from '@server/tests/utils/random'
import type { Insertable } from 'kysely'
import type { AuthUser } from '../user'
import type { TraitPublic } from '../traits'

export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    firstName: random.first(),
    lastName: random.last(),
    password: 'Verysafe_!123',
    ...overrides,
  }) satisfies Insertable<User>

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: random.integer({
    min: 1,
    max: 1000000,
  }),
  email: random.email(),
  ...overrides,
})

export const fakeTrait = <T extends Partial<Insertable<Trait>>>(
  overrides: T = {} as T
) =>
  ({
    name: random.name(),
    tempoMultiplier: random.integer({ min: 1, max: 3 }),
    moodMultiplier: random.integer({ min: 1, max: 3 }),
    energyMultiplier: random.integer({ min: 1, max: 3 }),
    complexityMultiplier: random.integer({ min: 1, max: 3 }),
    genreId: random.integer({ min: 1, max: 3 }),
    genreBias: random.integer({ min: 0, max: 3 }),
    ...overrides,
  }) satisfies Insertable<Trait>

export const fakeTraitPublic = <T extends Partial<Insertable<TraitPublic>>>(
  overrides: T = {} as T
) =>
  ({
    id: random.integer({ min: 1, max: 3 }),
    name: random.string(),
    ...overrides,
  }) satisfies Insertable<TraitPublic>

export const fakeGenre = <T extends Partial<Insertable<Genre>>>(
  overrides: T = {} as T
) =>
  ({
    name: random.string(),
    ...overrides,
  }) satisfies Insertable<Genre>

export const fakeStravaTokens = <T extends Partial<Insertable<StravaTokens>>>(
  overrides: T = {} as T
) =>
  ({
    userId: random.integer({ min: 1, max: 3 }),
    accessToken: random.string(),
    refreshToken: random.string(),
    stravaUserId: random.integer({ min: 1, max: 100 }),
    expiresAt: Math.floor(Date.now() / 1000) + 86400, // always a day in the future
    ...overrides,
  }) satisfies Insertable<StravaTokens>

export const fakeActivity = <T extends Partial<Insertable<Activity>>>(
  overrides: T = {} as T
) =>
  ({
    userId: random.integer({ min: 1, max: 1000 }),
    type: random.pickone(['ride', 'static', 'run']) as
      | 'ride'
      | 'static'
      | 'run',
    origin: 'strava',
    originId: String(random.integer({ min: 1, max: 10000 })),
    title: random.string({ length: 30 }),
    duration: random.integer({ min: 1, max: 200000 }),
    heartrate: random.integer({ min: 1, max: 300 }),
    calories: random.integer({ min: 1, max: 20000 }),
    speedAverage: random.integer({ min: 1, max: 1000 }),
    distance: random.integer({ min: 1, max: 20000 }),
    cadence: random.integer({ min: 1, max: 150 }),
    startTime: new Date().toISOString(),
    ...overrides,
  }) satisfies Insertable<Activity>
