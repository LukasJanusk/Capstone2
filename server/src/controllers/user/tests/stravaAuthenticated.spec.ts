import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeStravaTokens, fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import userRouter from '../index'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)

const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, logger }, user))

it('returns true when user is authenticated', async () => {
  await insertAll(db, 'stravaTokens', fakeStravaTokens({ userId: user.id }))
  const authenticated = await caller.stravaAuthenticated()

  expect(authenticated).toEqual({ authenticated: true })
})
it('returns false when user is not strava authenticated', async () => {
  const notAuth = await caller.stravaAuthenticated()

  expect(notAuth).toEqual({ authenticated: false })
})
