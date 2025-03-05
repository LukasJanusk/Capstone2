import { createTestDatabase } from '@tests/utils/database'
import { fakeUser, fakeTrait, fakeGenre } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const caller = createCaller({ db })

it('returns webtoken when signed in', async () => {
  const user = fakeUser({ email: 'some@mail.com' })
  await insertAll(db, 'user', user)

  const { accessToken } = await caller.login({
    email: user.email,
    password: user.password,
  })
  expect(accessToken).toEqual(expect.any(String))
})
it('throws an error when email not found', async () => {
  const user = fakeUser({ email: 'some@mail.com' })
  await expect(
    caller.login({ email: user.email, password: user.password })
  ).rejects.toThrow(/email not found/i)
})
