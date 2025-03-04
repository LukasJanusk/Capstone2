import type { Database } from '@server/database'
import type { User, UserTraits } from '@server/database/types'
import type { Trait } from '@server/entities/traits'
import {
  userKeysDb,
  userKeysPublic,
  type ApplicationUser,
  type UserPublic,
} from '@server/entities/user'
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
        .select(userKeysDb)
        .where('email', '=', email)
        .executeTakeFirstOrThrow()

      return user
    },
    // TODO: Refactor into one db call later
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
          'trait.complexityMultiplier',
          'trait.tempoMultiplier',
          'trait.energyMultiplier',
          'trait.moodMultiplier',
          'trait.genreId',
          'trait.genreBias',
        ])
        .where('user.id', '=', id)
        .execute()

      const stravaTokens = await db
        .selectFrom('stravaTokens')
        .select(['accessToken', 'refreshToken'])
        .where('stravaTokens.userId', '=', id)
        .executeTakeFirstOrThrow()

      // @ts-ignore we set return value to float with pg-type
      // but ts does not recognize it
      return { ...user, traits: userTraits as Trait[], strava: stravaTokens }
    },
    async createUserTrait(
      userId: number,
      traitId: number
    ): Promise<Selectable<UserTraits>> {
      return db
        .insertInto('userTraits')
        .values({ userId, traitId })
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
