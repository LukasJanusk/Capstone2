import { createTestDatabase } from '@tests/utils/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const caller = createCaller({ db })

it('returns webtoken when signed in', async () => {
  const user = fakeUser({
    email: 'some@mail.com',
    password: '$2a$06$.M6jb.XjAbwLDag6VB/6qed9pYiMyBehKvuhXN/7ZIhxY1wzzYpq6',
  })
  await insertAll(db, 'user', user)

  const { accessToken } = await caller.login({
    email: user.email,
    password: 'Password.123!',
  })
  expect(accessToken).toEqual(expect.any(String))
  const parts = accessToken.split('.')
  expect(parts.length).toEqual(3)
})
it('throws an error when email not found', async () => {
  const user = fakeUser({ email: 'some@mail.com' })
  await expect(
    caller.login({ email: user.email, password: user.password })
  ).rejects.toThrow(/email not found/i)
})

it('throws an error when password does not match', async () => {
  const user = fakeUser({
    email: 'some@mail.com',
    password: '$2a$06$.M6jb.XjAbwLDag6VB/6qed9pYiMyBehKvuhXN/7ZIhxY1wzzYpq6',
  })
  await insertAll(db, 'user', user)

  await expect(
    caller.login({ email: 'some@mail.com', password: 'wrongPassword#!1' })
  ).rejects.toThrow(/incorrect password/i)
})
