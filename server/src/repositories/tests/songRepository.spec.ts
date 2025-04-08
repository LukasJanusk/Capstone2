import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'

import { songRepository } from '../songRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = songRepository(db)

describe('createGenerationTask', () => {
  it('creates new task', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const taskId = 'someTaskId'
    const activity = fakeActivity({ userId: user.id })
    const [activityInDb] = await insertAll(db, 'activity', activity)

    const task = await repository.createGenerationTask({
      taskId,
      userId: user.id,
      activityId: activityInDb.id,
    })

    expect(task).toEqual({
      id: expect.any(Number),
      userId: user.id,
      taskId,
      activityId: activityInDb.id,
    })
  })
})
describe('getByTaskId', async () => {
  it('returns task when found', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const taskId = 'sometaskId'
    const activity = fakeActivity({ userId: user.id })
    const [activityInDb] = await insertAll(db, 'activity', activity)

    const [taskInserted] = await insertAll(db, 'generationTask', {
      taskId,
      userId: user.id,
      activityId: activityInDb.id,
    })
    const returned = await repository.getByTaskId(taskId)

    expect(returned).toEqual(taskInserted)
  })
  it('throws an error when no task was found', async () => {
    await expect(repository.getByTaskId('someNotExistingId')).rejects.toThrow(
      /no result/i
    )
  })
})
describe('createSong', () => {
  it('creates song', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const [activity] = await insertAll(
      db,
      'activity',
      fakeActivity({ userId: user.id })
    )
    const [generationTask] = await insertAll(db, 'generationTask', {
      taskId: '123task',
      activityId: activity.id,
      userId: user.id,
    })
    const song1 = {
      originId: 'someId',
      userId: user.id,
      taskId: generationTask.id,
      activityId: activity.id,
      audioUrl: 'url_to_song.example.com',
      imageUrl: 'url_to_image.example.com',
      title: 'Great Song!',
      prompt: 'This was the prompt to generate song',
    }
    const song2 = {
      originId: 'someOtherId',
      userId: user.id,
      taskId: generationTask.id,
      activityId: activity.id,
      audioUrl: 'url_to_song2.example.com',
      imageUrl: 'url_to_image2.example.com',
      title: 'Great Song the second',
      prompt: 'This was another prompt',
    }
    const insertedSongs = await repository.createSong([song1, song2])

    expect(insertedSongs.length).toEqual(2)
    expect(insertedSongs).toContainEqual({ id: expect.any(Number), ...song1 })
    expect(insertedSongs).toContainEqual({ id: expect.any(Number), ...song2 })
  })
})
describe('getSongByUserId', () => {
  it('returns song when found', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
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

    const [found] = await repository.getSongByUserId(user.id)

    expect(found).toEqual(songInDb)
  })
  it('returns an empty array when no songs were found', async () => {
    const notFound = await repository.getSongByUserId(999999)

    expect(notFound).toEqual([])
  })
})
