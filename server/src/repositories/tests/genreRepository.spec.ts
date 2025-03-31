import { expect, describe, it } from 'vitest'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeGenre } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { genreRepository } from '../genreRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = genreRepository(db)

describe('getAll', () => {
  it('returns all Genres', async () => {
    const genresInDb = await selectAll(db, 'genre')
    const genresAdded = await insertAll(db, 'genre', [
      fakeGenre(),
      fakeGenre(),
      fakeGenre(),
    ])

    const allGenres = await repository.getAll()

    expect(allGenres.length).toEqual(genresInDb.length + genresAdded.length)
  })
})
