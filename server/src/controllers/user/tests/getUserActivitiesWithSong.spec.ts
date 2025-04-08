import { createCallerFactory } from '@server/trpc'
import { authContext } from '@tests/utils/context'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import userRouter from '..'
import { createFakeStravaService } from '../../strava/services/tests/utils/fakeService'

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, stravaService, logger }, user))

it('returns activities with songs', async () => {
  const [activity] = await insertAll(
    db,
    'activity',
    fakeActivity({ userId: user.id })
  )
  const [generationTask] = await insertAll(db, 'generationTask', {
    taskId: '123',
    activityId: activity.id,
    userId: user.id,
  })
  const [songInDb] = await insertAll(db, 'song', {
    originId: 'someId',
    userId: user.id,
    activityId: activity.id,
    taskId: generationTask.id,
    audioUrl: 'url.example.com',
    imageUrl: 'url.example.com',
    title: 'workout song',
    prompt: 'Generate nice song',
  })
  const response = await caller.getUserActivitiesWithSongs()

  expect(response).toEqual([
    {
      activity,
      songs: [songInDb],
    },
  ])
})
it('returns activities with empty songs array when there are no songs in db', async () => {
  const [activity] = await insertAll(
    db,
    'activity',
    fakeActivity({ userId: user.id })
  )

  const activitiesWithoutSongs = await caller.getUserActivitiesWithSongs()

  expect(activitiesWithoutSongs).toEqual([{ activity, songs: [] }])
})
