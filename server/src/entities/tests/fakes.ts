import type { User, Trait, Genre, StravaTokens } from '@server/database'
import { random } from '@server/tests/utils/random'
import type { Insertable } from 'kysely'
import type { AuthUser } from '../user'

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
    genreBias: random.integer({ min: 1, max: 3 }),
    ...overrides,
  }) satisfies Insertable<Trait>

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
    ...overrides,
  }) satisfies Insertable<StravaTokens>
