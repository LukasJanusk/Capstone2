import { createCallerFactory } from '@server/trpc'
import { requestContext } from '@tests/utils/context'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import { insertAll, selectAll } from '@tests/utils/records'
import { fakeStravaTokens, fakeUser } from '@server/entities/tests/fakes'
import stravaRouter from '..'
import {
  fakeWebhook,
  mockActivityResponse,
  stravaActivityResponse,
} from '../services/tests/utils/fakes'
import { createStravaService } from '../services'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(stravaRouter)
const stravaService = createStravaService('valid_id', 'valid_secret')
const caller = createCaller(
  requestContext({
    req: {
      method: 'POST',
    } as any,
    db,
    stravaService,
    logger,
  })
)

it('stores activity into db', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const fakeTokens = fakeStravaTokens({ userId: user.id })
  const [tokens] = await insertAll(db, 'stravaTokens', fakeTokens)
  const data = stravaActivityResponse({ athlete: { id: tokens.stravaUserId } })
  const mockResponse = mockActivityResponse(data)
  vi.stubGlobal(
    'fetch',
    vi.fn(() => mockResponse)
  )
  const webhook = fakeWebhook({ owner_id: tokens.stravaUserId })

  const result = await caller.webhooks(webhook)

  expect(result).toEqual({ status: 'EVENT_RECEIVED' })
  const storedActivities = await selectAll(db, 'activity')

  expect(storedActivities.length).toEqual(1)
})
// it.skip('refreshes userTokens when expired', async () => {
//   const [user] = await insertAll(db, 'user', fakeUser())
//   const fakeTokens = fakeStravaTokens({ userId: user.id })
//   const [tokens] = await insertAll(db, 'stravaTokens', fakeTokens)
//   const data = stravaActivityResponse({ athlete: { id: tokens.stravaUserId } })
//   const mockResponse = mockActivityResponse(data)
//   vi.stubGlobal(
//     'fetch',
//     vi.fn(() => mockResponse)
//   )
//   vi.mock('../services', () => ({
//     createStravaService: () => ({
//       refreshUserAccessToken: () => ({
//         ...fakeTokens,
//         accessToken: 'new_access_token',
//         refreshToken: 'new_refresh_token',
//       }),
//       getActivityById: () =>
//         stravaActivityResponse({ athlete: { id: tokens.stravaUserId } }),
//     }),
//   }))

//   const webhook = fakeWebhook({ owner_id: tokens.stravaUserId })

//   const response = await caller.webhooks(webhook)

//   expect(webhook).toBeCalledWith(webhook)
// })
