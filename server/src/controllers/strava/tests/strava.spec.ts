import { createCallerFactory } from '@server/trpc'
import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import stravaRouter from '..'
import { createFakeStravaService } from '../services/tests/utils/fakeService'

const createCaller = createCallerFactory(stravaRouter)
const db = await wrapInRollbacks(createTestDatabase())
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, stravaService, logger }, user))

it('returns object with user id when tokens are accessed', async () => {
  const response = await caller.getAccess({ code: 'valid_code' })
  expect(response).toEqual({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  })
})
it('throws an error, when invalid code is provided', async () => {
  await expect(caller.getAccess({ code: 'invalid_code' })).rejects.toThrow(
    /error accessing strava servers/i
  )
})
it('throws an error when invalid client id is provided', async () => {
  const badService = createFakeStravaService('invalid_id', 'valid_secret')
  const { getAccess } = createCaller(
    authContext({ db, stravaService: badService })
  )
  await expect(getAccess({ code: 'valid_code' })).rejects.toThrow(
    /error accessing strava servers/i
  )
})
it('throws an error when invalid client secret is provided', async () => {
  const badSecretService = createFakeStravaService('valid_id', 'invalid_secret')
  const { getAccess } = createCaller(
    authContext({ db, stravaService: badSecretService })
  )
  await expect(getAccess({ code: 'valid_code' })).rejects.toThrow(
    /error accessing strava servers/i
  )
})
