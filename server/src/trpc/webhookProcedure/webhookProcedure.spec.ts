import createMusicGenerationService from '@server/controllers/generator/model'
import { createFakeStravaService } from '@server/controllers/strava/services/tests/utils/fakeService'
import { logger } from '@server/logger'
import { requestContext } from '@tests/utils/context'
import { createCallerFactory, router } from '..'
import { webhookProcedure } from '.'

const stravaService = createFakeStravaService(
  'valid_client_id',
  'valid_client_secret'
)
const songGenerationService = createMusicGenerationService('valid_api_key')

const routes = router({
  testCall: webhookProcedure.query(() => 'passed'),
  testCallPost: webhookProcedure.mutation(() => 'passed'),
})
const createCaller = createCallerFactory(routes)
const db = {} as any

it('Should not allow GET method', async () => {
  const caller = createCaller(
    requestContext(
      {
        db,
        stravaService,
        songGenerationService,
        logger,
      },
      'GET'
    )
  )
  await expect(caller.testCall()).rejects.toThrow(
    /endpoint accepts POST requests/i
  )
})
it('Should throw an Error when request object is not provided', async () => {
  const caller = createCaller({
    db,
    stravaService,
    songGenerationService,
    logger,
  })

  await expect(caller.testCall()).rejects.toThrow(/request object not found/i)
})
it('Should move to next middleware if request object is provided and method is POST', async () => {
  const caller = createCaller(
    requestContext(
      {
        db,
        stravaService,
        songGenerationService,
        logger,
      },
      'POST'
    )
  )

  await expect(caller.testCallPost()).resolves.toBe('passed')
})
