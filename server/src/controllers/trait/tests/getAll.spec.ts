import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeGenre, fakeTrait } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import createMusicGenerationService from '@server/controllers/generator/model'
import { createFakeStravaService } from '@server/controllers/strava/services/tests/utils/fakeService'
import traitRouter from '../index'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(traitRouter)
const songGenerationService = createMusicGenerationService('valid_api_key')
const stravaService = createFakeStravaService(
  'valid_client_id',
  'valid_client_secret'
)
const caller = createCaller({ db, songGenerationService, stravaService })
const [genre] = await insertAll(db, 'genre', fakeGenre())

it('returns all traits', async () => {
  const currentTraits = await selectAll(db, 'trait')
  await insertAll(db, 'trait', [
    fakeTrait({ genreId: genre.id }),
    fakeTrait({ genreId: genre.id }),
  ])
  const response = await caller.getAll()
  expect(response.length).toEqual(currentTraits.length + 2)
})
