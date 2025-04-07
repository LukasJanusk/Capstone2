import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { userRepository } from '@server/repositories/userRepository'
import { insertAll } from '@tests/utils/records'
import { fakeStravaTokens, fakeUser } from '@server/entities/tests/fakes'
import { createFakeStravaService } from '../../services/tests/utils/fakeService'
import getStravaUserTokens from '../getStravaUserTokens'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const [user] = await insertAll(db, 'user', fakeUser())

it('returns tokens from db when tokens are active', async () => {
  //
  const [tokens] = await insertAll(
    db,
    'stravaTokens',
    fakeStravaTokens({
      userId: user.id,
      accessToken: 'valid_token',
      refreshToken: 'valid_token',
    })
  )
  const result = await getStravaUserTokens(
    tokens.stravaUserId,
    stravaService,
    repository
  )

  expect(result).toEqual(tokens)
})
it('it refreshes expired tokens, stores them in db and retruns refreshed tokens', async () => {
  const [tokens] = await insertAll(
    db,
    'stravaTokens',
    fakeStravaTokens({
      userId: user.id,
      accessToken: 'valid_token',
      refreshToken: 'valid_token',
      expiresAt: 1231321,
    })
  )
  const result = await getStravaUserTokens(
    tokens.stravaUserId,
    stravaService,
    repository
  )

  expect(result).toEqual({
    ...tokens,
    expiresAt: expect.any(Number),
    accessToken: 'refreshed_token',
    refreshToken: 'refreshed_token',
  })
})
