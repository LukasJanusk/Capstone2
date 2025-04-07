import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeActivity, fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { activityRepository } from '../activityRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = activityRepository(db)

describe('create', () => {
  it('creates activity', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const activity = fakeActivity({ userId: user.id })
    const inserted = await repository.create(activity)

    expect(inserted).toEqual({ id: expect.any(Number), ...activity })
  })
})
describe('getActivitiesByUserId', () => {
  it('returns activities when found', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const [activity] = await insertAll(
      db,
      'activity',
      fakeActivity({ userId: user.id })
    )

    const [inserted] = await repository.getActivitiesByUserId(user.id)

    expect(inserted).toEqual(activity)
  })
  it('returns an empty array when no activities were found', async () => {
    const notFound = await repository.getActivitiesByUserId(99999)

    expect(notFound).toEqual([])
  })
})
