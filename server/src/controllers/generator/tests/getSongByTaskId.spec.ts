import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { vi } from 'vitest'
import songRouter from '../index'
import createMusicGenerationService from '../model'
import { mockGetSongsByTaskIdResponse } from './fakes'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(songRouter)
const songGenerationService = createMusicGenerationService('someApiKey')
const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, songGenerationService }, user))

it('generates new songs when no song with matching taskId is found', async () => {
  const [activity] = await insertAll(
    db,
    'activity',
    fakeActivity({ userId: user.id })
  )

  const [generationTask] = await insertAll(db, 'generationTask', {
    activityId: activity.id,
    taskId: 'toGenerate',
    userId: user.id,
  })
  vi.stubGlobal(
    'fetch',
    vi.fn(() => mockGetSongsByTaskIdResponse())
  )
  const result = await caller.getSongByTaskId()

  expect(result).toEqual([
    {
      activity,
      songs: [
        {
          activityId: activity.id,
          audioUrl: 'https://example.cn/****.mp3',
          id: expect.any(Number),
          imageUrl: 'https://example.cn/****.jpeg',
          originId: '8551****662c',
          prompt: '[Verse] 夜晚城市 灯火辉煌',
          taskId: generationTask.id,
          title: '钢铁侠',
          userId: user.id,
        },
      ],
    },
  ])
})
