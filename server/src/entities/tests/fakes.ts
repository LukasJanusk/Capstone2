import type { User, Trait } from '@server/database'
import { random } from '@server/tests/utils/random'
import type { Insertable } from 'kysely'
import type { AuthUser } from '../user'
import type { Trait } from '../traits'

export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    firstName: random.first(),
    lastName: random.last(),
    password: 'Verysafe_!123',
    traits: [1, 2, 3],
    strava: { accessToken: null, refreshToken: null },
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
    tempoMultiplier: random.floating({ fixed: 2, min: 0, max: 100 }),
    moodMultiplier: random.floating({ fixed: 2, min: 0, max: 100 }),
    energyMultiplier: random.floating({ fixed: 2, min: 0, max: 100 }),
    complexityMultiplier: random.floating({ fixed: 2, min: 0, max: 100 }),
    genre: random.integer(),
    genreBias: random.floating({ fixed: 2, min: 0, max: 100 }),
    ...overrides,
  }) satisfies Insertable<Trait>
