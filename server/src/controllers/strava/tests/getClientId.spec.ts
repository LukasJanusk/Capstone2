import { createCallerFactory } from '@server/trpc'
import { requestContext } from '@tests/utils/context'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import stravaRouter from '..'
import { createFakeStravaService } from '../services/tests/utils/fakeService'

const createCaller = createCallerFactory(stravaRouter)
const db = await wrapInRollbacks(createTestDatabase())
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const caller = createCaller(requestContext({ db, stravaService, logger }))

it('returns client id', async () => {
  const clientId = await caller.getClientId()

  expect(clientId).toBe('148802')
})
