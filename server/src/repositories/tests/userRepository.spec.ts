import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeUser,
  fakeTrait,
  fakeGenre,
  fakeStravaTokens,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)

describe('create', () => {
  it('creates a new user', async () => {
    const user1 = fakeUser()
    const createdUser = await repository.create(user1)

    expect(createdUser).toEqual({
      id: expect.any(Number),
      firstName: user1.firstName,
      lastName: user1.lastName,
    })
  })
})
describe('findByEmail', () => {
  it('returns non public user data', async () => {
    const userEmail = 'some@email.com'
    const [user2] = await insertAll(db, 'user', fakeUser({ email: userEmail }))
    const foundUser = await repository.findByEmail(userEmail)

    expect(foundUser).toEqual(user2)
  })
})
describe('findUserFull', async () => {
  it('returns full user data with traits and strava tokens', async () => {
    const genres = await insertAll(db, 'genre', [
      fakeGenre(),
      fakeGenre(),
      fakeGenre(),
    ])

    const genreIds = genres.map((g) => g.id)
    const traits = await insertAll(db, 'trait', [
      fakeTrait({ genreId: genreIds[0] }),
      fakeTrait({ genreId: genreIds[1] }),
      fakeTrait({ genreId: genreIds[2] }),
    ])

    const traitIds = traits.map((t) => t.id)

    const [user] = await insertAll(db, 'user', fakeUser())
    await insertAll(db, 'userTraits', [
      {
        userId: user.id,
        traitId: traitIds[0],
      },
      {
        userId: user.id,
        traitId: traitIds[1],
      },
      {
        userId: user.id,
        traitId: traitIds[2],
      },
    ])
    const [tokens] = await insertAll(
      db,
      'stravaTokens',
      fakeStravaTokens({ userId: user.id })
    )

    const fullUserData = await repository.findUserFull(user.id)

    expect(fullUserData?.strava.accessToken).toEqual(tokens.accessToken)
    expect(fullUserData?.strava.refreshToken).toEqual(tokens.refreshToken)
    expect(fullUserData?.traits).toEqual(traits)
  })
})
describe('createUserTrait', () => {
  it('creates user trait', async () => {
    const [genre] = await insertAll(db, 'genre', fakeGenre())
    const [trait] = await insertAll(
      db,
      'trait',
      fakeTrait({ genreId: genre.id })
    )
    const [user] = await insertAll(db, 'user', fakeUser())

    const userTrait = await repository.createUserTrait([
      { userId: user.id, traitId: trait.id },
    ])
    expect(userTrait).toEqual([
      {
        id: expect.any(Number),
        userId: user.id,
        traitId: trait.id,
      },
    ])
  })
})
describe('createUserTrait', () => {
  it('creates user trait', async () => {
    const [genre] = await insertAll(db, 'genre', fakeGenre())
    const [trait] = await insertAll(
      db,
      'trait',
      fakeTrait({ genreId: genre.id })
    )
    const [user] = await insertAll(db, 'user', fakeUser())

    const userTraits = await repository.createUserTrait([
      {
        userId: user.id,
        traitId: trait.id,
      },
    ])

    expect(userTraits).toEqual([
      {
        id: expect.any(Number),
        userId: user.id,
        traitId: trait.id,
      },
    ])
  })
})
describe('storeTokens', () => {
  it('stores user tokens to db', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const tokens = fakeStravaTokens({ userId: user.id })

    const stored = await repository.storeTokens(tokens)

    expect(stored).toEqual({ id: expect.any(Number), ...tokens })
  })
})
describe('getTokens', () => {
  it('returns stored tokens', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const tokens = fakeStravaTokens({ userId: user.id })
    const [tokensInDb] = await insertAll(db, 'stravaTokens', tokens)

    const stored = await repository.getTokens(user.id)

    expect(stored).toEqual(tokensInDb)
  })
})
describe('getTokensByStravaUserId', () => {
  it('returns stored tokens', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const tokens = fakeStravaTokens({ userId: user.id })
    const [tokensInDb] = await insertAll(db, 'stravaTokens', tokens)

    const stored = await repository.getTokensByStravaUserId(tokens.stravaUserId)

    expect(stored).toEqual(tokensInDb)
  })
})
describe('updateTokens', () => {
  it('updates tokens', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const tokens = fakeStravaTokens({ userId: user.id })
    await insertAll(db, 'stravaTokens', tokens)

    const updated = await repository.updateTokens(user.id, {
      accessToken: 'updatedAccess',
      refreshToken: 'updatedRefresh',
    })

    expect(updated.accessToken).toEqual('updatedAccess')
    expect(updated.refreshToken).toEqual('updatedRefresh')
  })
})
describe('updateEmail', () => {
  it('updates', async () => {
    const user = fakeUser()
    const [newUser] = await insertAll(db, 'user', user)

    const newEmail = { ...user, email: 'new@mail.com' }

    const changed = await repository.updateEmail(newUser.id, newEmail)

    expect(changed).toEqual({ id: newUser.id, email: 'new@mail.com' })
  })
})
