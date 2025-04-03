import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import songRouter from '../index'
import createMusicGenerationService from '../model'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(songRouter)

const songGenerationService = createMusicGenerationService('someApiKey')
const [user] = await insertAll(db, 'user', fakeUser())
const [activity] = await insertAll(
  db,
  'activity',
  fakeActivity({ userId: user.id })
)
const caller = createCaller(authContext({ db, songGenerationService }, user))

afterEach(() => {
  vi.clearAllMocks()
})

it('successfuly returns song request object', async () => {
  vi.stubGlobal('fetch', () =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          code: 200,
          msg: 'success',
          data: { task_id: '5c79****be8e' },
        }),
    })
  )

  const songRequest = await caller.requestSong({
    prompt: 'Generate me a nice song',
    style: 'rock',
    title: 'dolphin song',
    activityId: activity.id,
  })

  expect(songRequest).toEqual({
    id: expect.any(Number),
    userId: user.id,
    taskId: '5c79****be8e',
    activityId: activity.id,
  })
})
it('throws an error when API does not generate taskId', async () => {
  vi.stubGlobal('fetch', () =>
    Promise.resolve({
      json: () => Promise.resolve({ code: 400, message: 'UNAUTHORIZED' }),
    })
  )

  await expect(
    caller.requestSong({
      prompt: 'Generate me a nice song',
      style: 'Rock',
      title: 'dolphin song',
      activityId: activity.id,
    })
  ).rejects.toThrow(/API failed/i)
})
