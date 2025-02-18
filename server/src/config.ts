import 'dotenv/config'
import { z } from 'zod'

const { env } = process
if (!env.NODE_ENV) env.NODE_ENV = 'development'

// force UTC timezone, so it matches the default timezone in production
env.TZ = 'UTC'

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),
    stravaClientId: z.string(),
    stravaClientSecret: z.string(),
    stravaSubscribtionKey: z.string(),
    database: z.object({
      connectionString: z.string().url(),
    }),
  })
  .readonly()
const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,
  stravaClientId: env.STRAVA_CLIENT_ID,
  stravaClientSecret: env.STRAVA_CLIENT_SECRET,
  stravaSubscribtionKey: env.STRAVA_SUBSCRIBTION_SECRET,
  database: {
    connectionString: env.DATABASE_URL,
  },
})

export default config

function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
