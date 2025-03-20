import { fakeAuthUser } from '@server/entities/tests/fakes'
import { authUserSchema, type AuthUser } from '@server/entities/user'
import type { Context, ContextMinimal } from '@server/trpc'
import createMusicGenerationService from '@server/controllers/generator/model'
import { createFakeStravaService } from '@server/controllers/strava/services/tests/utils/fakeService'

const stravaService = createFakeStravaService(
  'valid_client_id',
  'valid_client_secret'
)
const songGenerationService = createMusicGenerationService('valid_api_key')

export const requestContext = (
  context: Partial<Context> & ContextMinimal
): Context => ({
  req: {
    header: () => undefined,
    get: () => undefined,
  } as any,
  res: {
    cookie: () => undefined,
  } as any,
  stravaService,
  songGenerationService,
  ...context,
})

export const authContext = (
  context: Partial<Context> & ContextMinimal,
  user: AuthUser = fakeAuthUser()
): Context => ({
  authUser: authUserSchema.parse(user),
  stravaService,
  songGenerationService,
  ...context,
})

export const authRepoContext = (
  repos: any, // Context['repos'], but easier to work with any in tests
  user: AuthUser = fakeAuthUser()
): Context => ({
  authUser: authUserSchema.parse(user),
  ...requestContext({
    db: {} as any,
    repos,
  }),
})
