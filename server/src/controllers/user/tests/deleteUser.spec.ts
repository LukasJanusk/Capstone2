import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { logger } from '@server/logger'
import userRouter from '../index'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)

const [user] = await insertAll(db, 'user', fakeUser())
const caller = createCaller(authContext({ db, logger }, user))

it('returns user id and email changed', async () => {
  const deleted = await caller.deleteUser({
    email: user.email,
  })

  expect(deleted).toEqual({ id: user.id })
})
