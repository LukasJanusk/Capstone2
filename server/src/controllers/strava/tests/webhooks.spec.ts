import { createCallerFactory } from '@server/trpc'
import { requestContext } from '@tests/utils/context'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { logger, type Logger } from '@server/logger'
import { insertAll, selectAll } from '@tests/utils/records'
import { fakeStravaTokens, fakeUser } from '@server/entities/tests/fakes'
import type { SongGenerationService } from '@server/controllers/generator/model'
import stravaRouter from '..'
import {
  fakeWebhook,
  mockActivityResponse,
  stravaActivityResponse,
} from '../services/tests/utils/fakes'
import { createStravaService } from '../services'

const songGenerationService = {
  requestSong: (title: string, style: string, prompt: string) => {
    if (title && style && prompt) {
      return { code: 200, msg: 'success', data: { task_id: '123' } }
    }
    return { code: 400, msg: 'fail' }
  },
} as unknown as SongGenerationService
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
    songGenerationService,
    logger,
  })
)

it('stores activity into db and request to create a song, stores generation task to db', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const fakeTokens = fakeStravaTokens({
    userId: user.id,
    expiresAt: Math.floor(Date.now() / 1000) + 604800,
  })
  const [tokens] = await insertAll(db, 'stravaTokens', fakeTokens)
  const data = stravaActivityResponse({ athlete: { id: tokens.stravaUserId } })
  const activitiesInDb = await selectAll(db, 'activity')
  const mockResponse = mockActivityResponse(data)
  vi.stubGlobal(
    'fetch',
    vi.fn(() => mockResponse)
  )
  const webhook = fakeWebhook({ owner_id: tokens.stravaUserId })

  const result = await caller.webhooks(webhook)

  expect(result).toEqual({ status: 'EVENT_RECEIVED' })
  const storedActivities = await selectAll(db, 'activity')
  const [storedTask] = await selectAll(db, 'generationTask')
  expect(storedActivities.length).toEqual(activitiesInDb.length + 1)
  expect(storedTask).toEqual({
    id: expect.any(Number),
    activityId: storedActivities[0].id,
    userId: user.id,
    taskId: '123',
  })
})
it('throws an error when activity was not found or failed to fetch from strava servers', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })
    )
  )
  const [user] = await insertAll(db, 'user', fakeUser())
  const [tokens] = await insertAll(
    db,
    'stravaTokens',
    fakeStravaTokens({
      userId: user.id,
      expiresAt: Math.floor(Date.now() / 1000) + 604800,
    })
  )
  const webhook = fakeWebhook({
    aspect_type: 'create',
    event_time: 12341241241,
    object_id: 1,
    object_type: 'activity',
    owner_id: tokens.stravaUserId,
  })

  await expect(caller.webhooks(webhook)).rejects.toThrow(/activity not found/i)
})
it('logs an error when song generation API fails to create generation task', async () => {
  //
  const songGenerationService2 = {
    requestSong: (title: string, style: string, prompt: string) => {
      if (title && style && prompt) {
        return { code: 400, msg: 'fail' }
      }
      return { code: 400, msg: 'fail' }
    },
  } as unknown as SongGenerationService
  const loggerMock = {
    info: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger
  const caller2 = createCaller(
    requestContext({
      req: {
        method: 'POST',
      } as any,
      db,
      stravaService,
      songGenerationService: songGenerationService2,
      logger: loggerMock,
    })
  )
  const [user] = await insertAll(db, 'user', fakeUser())
  const fakeTokens = fakeStravaTokens({
    userId: user.id,
    expiresAt: Math.floor(Date.now() / 1000) + 604800,
  })
  const [tokens] = await insertAll(db, 'stravaTokens', fakeTokens)
  const data = stravaActivityResponse({ athlete: { id: tokens.stravaUserId } })
  const activitiesInDb = await selectAll(db, 'activity')
  const mockResponse = mockActivityResponse(data)
  vi.stubGlobal(
    'fetch',
    vi.fn(() => mockResponse)
  )
  const webhook = fakeWebhook({ owner_id: tokens.stravaUserId })

  const result = await caller2.webhooks(webhook)
  const storedActivities = await selectAll(db, 'activity')
  expect(storedActivities.length).toEqual(activitiesInDb.length + 1)
  expect(result).toEqual({ status: 'EVENT_RECEIVED' })
  expect(loggerMock.info).toHaveBeenCalledWith(
    expect.objectContaining({ activityId: expect.any(Number) }),
    'POST strava.webhooks received new webhook from Strava'
  )
})
