import type { User } from '@cap/server/src/shared/trpc'
import type { Insertable } from 'kysely'
import { Chance } from 'chance'

export const random = process.env.CI ? Chance(1) : Chance()

export const fakeUser = <T extends Partial<Insertable<User>>>(overrides: T = {} as T) =>
  ({
    email: random.email(),
    firstName: random.first(),
    lastName: random.last(),
    password: 'Verysecure!123',
    ...overrides,
  }) satisfies Insertable<User>
