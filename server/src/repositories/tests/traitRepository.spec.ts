import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import { fakeTrait, fakeGenre, fakeUser } from '@server/entities/tests/fakes'
import { traitRepository } from '../traitRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = traitRepository(db)
const [genre] = await insertAll(db, 'genre', fakeGenre())

describe('create', () => {
  it('creates trait', async () => {
    const trait = fakeTrait({ genreId: genre.id })

    const created = await repository.create(trait)

    const [inDb] = await selectAll(db, 'trait', (eb) =>
      eb('trait.id', '=', created.id)
    )
    expect(created).toEqual({ id: expect.any(Number), name: inDb.name })
  })
})
describe('getAll', () => {
  it('returns all traits', async () => {
    const currentTraits = await selectAll(db, 'trait')
    const traits = await insertAll(db, 'trait', [
      fakeTrait({ genreId: genre.id }),
      fakeTrait({ genreId: genre.id }),
    ])

    const inDb = await repository.getAllPublic()
    expect(inDb.length).toEqual(2 + currentTraits.length)
    expect(inDb).toContainEqual({
      id: expect.any(Number),
      name: traits[0].name,
    })
    expect(inDb).toContainEqual({
      id: expect.any(Number),
      name: traits[1].name,
    })
  })
})
describe('findByIdPublic', () => {
  it('returns only public trait information', async () => {
    const [trait] = await insertAll(
      db,
      'trait',
      fakeTrait({ genreId: genre.id })
    )

    const publicTrait = await repository.findByIdPublic(trait.id)

    expect(publicTrait).toEqual({ id: expect.any(Number), name: trait.name })
  })
})
describe('findByIdFull', () => {
  it('returns full trait information', async () => {
    const fake = fakeTrait({ genreId: genre.id })
    const [trait] = await insertAll(db, 'trait', fake)

    const fullTrait = await repository.findByIdFull(trait.id)

    expect(fullTrait).toEqual({ id: expect.any(Number), ...fake })
  })
})
describe('getUserTraitsFull', () => {
  it('returns array of user traits', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const allTraits = await selectAll(db, 'trait')
    await insertAll(db, 'userTraits', [
      { userId: user.id, traitId: allTraits[0].id },
      { userId: user.id, traitId: allTraits[1].id },
      { userId: user.id, traitId: allTraits[2].id },
    ])

    const allUserTraits = await repository.getUserTraitsFull(user.id)

    expect(allUserTraits.length).toEqual(3)
    expect(allUserTraits).toContainEqual(allTraits[0])
    expect(allUserTraits).toContainEqual(allTraits[1])
    expect(allUserTraits).toContainEqual(allTraits[2])
  })
  it('returns empty array when there are no user traits', async () => {
    //
    const [user] = await insertAll(db, 'user', fakeUser())

    const allUserTraits = await repository.getUserTraitsFull(user.id)

    expect(allUserTraits).toEqual([])
  })
})
