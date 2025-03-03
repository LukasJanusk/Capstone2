import type { Database } from '@server/database'
import type { User } from '@server/database/types'
import {
  userKeysPublic,
  type ApplicationUser,
  type UserPublic,
} from '@server/entities/user'
import { traitKeysPublic } from '@server/entities/traits'
import type { Insertable, Selectable } from 'kysely'

export function userRepository(db: Database) {
  return {
    async create(user: Insertable<User>): Promise<UserPublic> {
      return db
        .insertInto('user')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },
    async findByEmail(email: string): Promise<Selectable<User> | undefined> {
      const user = await db
        .selectFrom('user')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()

      return user
    },
    async findUserFull(id: number): Promise<ApplicationUser | undefined> {
      const user = await db
        .selectFrom('user')
        .selectAll()
        .where('user.id', '=', id)
        .executeTakeFirstOrThrow()

      const userTraits = await db
        .selectFrom('trait')
        .innerJoin('userTraits', 'trait.id', 'userTraits.traitId')
        .innerJoin('user', 'userTraits.userId', 'user.id')
        .select([
          'trait.id',
          'trait.name',
          db.raw('CAST(tempo_multiplier AS FLOAT) AS tempo_multiplier'),
          db.raw('CAST(mood_multiplier AS FLOAT) AS mood_multiplier'),
          db.raw('CAST(energy_multiplier AS FLOAT) AS energy_multiplier'),
          db.raw('CAST(complexity_multiplier AS FLOAT) AS complexity_multiplier'),
          'trait.genre',
          db.raw('CAST(genre_bias AS FLOAT) AS genre_bias')
        ])
        .where('trait.id', '=', id)
        .execute()

      const stravaTokens = await db
        .selectFrom('stravaTokens')
        .select(['accessToken', 'refreshToken'])
        .where('stravaTokens.userId', '=', id)
        .executeTakeFirstOrThrow()
      
        const traitParsed =
      return { ...user, traits: userTraits, strava: stravaTokens }
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
