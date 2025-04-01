import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { fakeUser } from '@server/entities/tests/fakes'

import { songRepository } from '../songRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = songRepository(db)

describe('createGenerationTask', () => {
  it('creates new task', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const taskId = 'sometaskId'

    const task = await repository.createGenerationTask({
      taskId,
      userId: user.id,
    })

    expect(task).toEqual({ id: expect.any(Number), userId: user.id, taskId })
  })
})
describe('getByTaskId', async () => {
  it('returns task when found', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const taskId = 'sometaskId'

    const [taskInserted] = await insertAll(db, 'generationTask', {
      taskId,
      userId: user.id,
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
