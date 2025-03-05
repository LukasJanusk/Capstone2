import { createTestDatabase } from '@tests/utils/database'
import { fakeUser, fakeTrait, fakeGenre } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const caller = createCaller({ db })

it('should save a user', async () => {
  const user = fakeUser()
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  const response = await caller.signup({ ...user, traits })

  const [userCreated] = await selectAll(db, 'user', (eb) =>
    eb('email', '=', user.email)
  )

  expect(userCreated).toMatchObject({
    id: expect.any(Number),
    firstName: user.firstName,
    lastName: user.lastName,
    password: expect.not.stringContaining(user.password),
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response).toEqual({
    id: userCreated.id,
  })
})

it('should require a valid email', async () => {
  const user = fakeUser({ email: 'notgood' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  await expect(caller.signup({ ...user, traits })).rejects.toThrow(/email/i)
})

it('should require complex password', async () => {
  const user = fakeUser({ password: 'notgoodenough' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  await expect(caller.signup({ ...user, traits })).rejects.toThrow(/password/i)
})

it('stores lowercased email', async () => {
  const user = fakeUser({ email: 'GoodEmail@mail.com' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  const userReturned = await caller.signup({ ...user, traits })
  const [savedUser] = await selectAll(db, 'user', (eb) =>
    eb('user.id', '=', userReturned.id)
  )
  expect(savedUser.email).toEqual('goodemail@mail.com')
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser({ email: ' goodemail@mail.com ' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  const userReturned = await caller.signup({ ...user, traits })
  const [savedUser] = await selectAll(db, 'user', (eb) =>
    eb('user.id', '=', userReturned.id)
  )
  expect(savedUser.email).toEqual('goodemail@mail.com')
})

it('throws an error for duplicate email', async () => {
  const user = fakeUser({ email: 'duplicate@mail.com' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  await insertAll(db, 'user', user)

  const traits = [{ id: trait.id, name: trait.name }]
  const user2 = fakeUser({ email: 'duplicate@mail.com' })
  await expect(caller.signup({ ...user2, traits })).rejects.toThrow(/email/i)
})
it('throws an error when traits are not in db', async () => {
  const traits = [{ id: 99999, name: 'notInDb' }]
  const user = fakeUser()
  await expect(caller.signup({ ...user, traits })).rejects.toThrow(/trait/i)
})
it('saves user traits to db', async () => {
  const user = fakeUser({ email: 'goodemail@mail.com' })
  const [genre] = await insertAll(db, 'genre', [fakeGenre()])
  const [trait] = await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
  ])
  const traits = [{ id: trait.id, name: trait.name }]
  const userReturned = await caller.signup({ ...user, traits })
  const [userTraits] = await selectAll(db, 'userTraits', (eb) =>
    eb('userId', '=', userReturned.id)
  )
  expect(userTraits).toEqual({
    id: expect.any(Number),
    traitId: trait.id,
    userId: userReturned.id,
  })
})
