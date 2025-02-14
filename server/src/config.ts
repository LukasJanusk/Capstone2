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
    stravaClientId: z.number().int().positive(),
    stravaClientSecret: z.string(),
  })
  .readonly()
const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,
  stravaClientId: env.STRAVA_CLIENT_ID,
  straveClientSecret: env.STRAVA_CLIENT_SECRET,
})

export default config

function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
