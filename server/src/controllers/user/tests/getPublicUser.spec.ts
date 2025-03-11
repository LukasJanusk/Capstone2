import { createCallerFactory } from '@server/trpc'
import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { createFakeStravaService } from '../../strava/services/tests/utils/fakeService'

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const stravaService = createFakeStravaService('valid_id', 'valid_secret')
const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, stravaService }, user))

it('returns public user', async () => {
  const response = await caller.getPulbicUser({ id: user.id })

  expect(response).toEqual({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  })
})
it('throws error whan user id missmach auth user id', async () => {
  await expect(caller.getPulbicUser({ id: 912304124142 })).rejects.toThrow(
    /access denied/i
  )
})
