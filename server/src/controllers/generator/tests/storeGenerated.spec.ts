import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { createCallerFactory } from '@server/trpc'
import { logger } from '@server/logger'
import { createFakeStravaService } from '@server/controllers/strava/services/tests/utils/fakeService'
import { requestContext } from '@tests/utils/context'
import songRouter from '../index'
import createMusicGenerationService from '../model'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(songRouter)
const songGenerationService = createMusicGenerationService('someApiKey')
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const [user] = await insertAll(db, 'user', fakeUser())
const [activity] = await insertAll(
  db,
  'activity',
  fakeActivity({ userId: user.id })
)
const [generationTask] = await insertAll(db, 'generationTask', {
  activityId: activity.id,
  userId: user.id,
  taskId: 'task123',
})
const caller = createCaller(
  requestContext({
    db,
    songGenerationService,
    logger,
    stravaService,
  })
)
it('logs when text is generated and returns callback received', async () => {
  const webhook = {
    msg: 'success',
    code: 200,
    data: { callbackType: 'text', task_id: generationTask.taskId },
  }
  const logSpy = vi.spyOn(logger, 'info')
  const result = await caller.storeGenerated(webhook)
  expect(result).toEqual({
    code: 200,
    msg: 'Callback received successfully',
  })
  expect(logSpy).toBeCalledWith(
    { taskId: generationTask.taskId, userId: user.id },
    'POST generator.StoreGenerated - Text generated'
  )
})
it('logs that first song is generated and returns callback received', async () => {
  const webhook = {
    msg: 'success',
    code: 200,
    data: { callbackType: 'first', task_id: generationTask.taskId },
  }
  const logSpy = vi.spyOn(logger, 'info')
  const result = await caller.storeGenerated(webhook)
  expect(result).toEqual({
    code: 200,
    msg: 'Callback received successfully',
  })
  expect(logSpy).toBeCalledWith(
    { taskId: generationTask.taskId, userId: user.id },
    'POST generator.StoreGenerated - First song generated'
  )
})
it('logs when all songs are generated and stores songs to db, returns callback received', async () => {
  const webhook = {
    msg: 'success',
    code: 200,
    data: {
      callbackType: 'complete',
      task_id: generationTask.taskId,
      data: [
        {
          id: 'someId',
          audio_url: 'https://example.cn/audio1.mp3',
          source_audio_url: 'https://example.cn/source1.mp3',
          stream_audio_url: 'https://example.cn/stream1',
          createTime: '2025-01-01 00:00:00',
          duration: 198.44,
          prompt: 'Generate cool song',
          title: 'Rock this world',
        },
      ],
    },
  }

  const logSpy = vi.spyOn(logger, 'info')
  const result = await caller.storeGenerated(webhook)
  expect(result).toEqual({
    code: 200,
    msg: 'Callback received successfully',
  })
  expect(logSpy).toBeCalledWith(
    { taskId: generationTask.taskId, userId: user.id },
    'POST generator.StoreGenerated - Song generated'
  )
  const [song] = await selectAll(db, 'song')
  expect(song).toEqual({
    id: expect.any(Number),
    originId: webhook.data.data[0].id,
    audioUrl: webhook.data.data[0].audio_url,
    imageUrl: null,
    prompt: webhook.data.data[0].prompt,
    activityId: activity.id,
    taskId: generationTask.id,
    userId: user.id,
    title: webhook.data.data[0].title,
  })
})
