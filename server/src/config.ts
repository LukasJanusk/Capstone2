import 'dotenv/config'
import { z } from 'zod'

const { env } = process
if (!env.NODE_ENV) env.NODE_ENV = 'development'

env.TZ = 'UTC'

const isTest = env.NODE_ENV === 'test'
const isDevTest = env.NODE_ENV === 'development' || isTest

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),
    auth: z.object({
      tokenKey: z.string(),
      expiresIn: z.string().default('7d'),
      passwordCost: z.coerce.number().default(isDevTest ? 6 : 12),
    }),
    stravaClientId: z.string(),
    stravaClientSecret: z.string(),
    stravaSubscribtionKey: z.string(),
    database: z.object({
      connectionString: z.string().url(),
    }),
    apiBoxKey: z.string(),
    publicDomain: z.string().default('http://localhost:5173/'),
  })
  .readonly()
const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,
  auth: {
    tokenKey: env.TOKEN_KEY,
    expiresIn: env.TOKEN_EXPIRES_IN,
    passwordCost: env.PASSWORD_COST,
  },
  stravaClientId: env.STRAVA_CLIENT_ID,
  stravaClientSecret: env.STRAVA_CLIENT_SECRET,
  stravaSubscribtionKey: env.STRAVA_SUBSCRIBTION_SECRET,
  database: {
    connectionString: env.DATABASE_URL,
  },
  apiBoxKey: env.API_BOX_KEY,
  publicDomain: env.PUBLIC_DOMAIN,
})

export default config

function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
