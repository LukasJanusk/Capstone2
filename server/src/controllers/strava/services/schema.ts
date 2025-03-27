import z from 'zod'

const stravaUserSchema = z.object({
  id: z.number().int().positive(),
  firstname: z.string(),
  lastname: z.string(),
  weight: z.number().optional().nullable(),
})

const tokenSchema = z.object({
  token_type: z.literal('Bearer'),
  expires_at: z.coerce.number().int().positive(),
  expires_in: z.coerce.number().int().positive(),
  refresh_token: z.string(),
  access_token: z.string(),
  athlete: stravaUserSchema,
})
const refreshTokenSchema = tokenSchema.omit({ athlete: true })
export const webhookSchema = z.object({
  aspect_type: z.enum(['update', 'create', 'delete']),
  event_time: z.coerce.number().int().positive(),
  object_id: z.coerce.number().int().positive(),
  object_type: z.enum(['activity', 'athlete']),
  owner_id: z.coerce.number().int().positive(),
  subscription_id: z.coerce.number().int().positive(),
  updates: z.record(z.unknown()),
})

export const stravaActivitySchema = z.object({
  id: z.coerce.number().positive().int(),
  athlete: z.object({
    id: z.coerce.number().positive().int(),
  }),
  name: z.string().optional().nullable(),
  distance: z.coerce.number().positive().int().optional().nullable(),
  moving_time: z.coerce.number().positive().int().optional().nullable(),
  elapsed_time: z.coerce.number().positive().int().optional().nullable(),
  total_elevation_gain: z.coerce
    .number()
    .positive()
    .int()
    .optional()
    .nullable(),
  type: z.string().optional().nullable(),
  sport_type: z.string().optional().nullable(),
  start_date: z.string(),
  start_date_local: z.string(),
  average_speed: z.number().positive().optional().nullable(),
  max_speed: z.number().positive().optional().nullable(),
  average_cadence: z.number().positive().optional().nullable(),
  average_temp: z.number().positive().optional().nullable(),
  average_watts: z.number().positive().optional().nullable(),
  weighted_average_watts: z.number().positive().optional().nullable(),
  kilojoules: z.number().positive().optional().nullable(),
  device_watts: z.boolean().optional().nullable(),
  has_heartrate: z.boolean().optional().nullable(),
  average_heartrate: z.number().optional().nullable(),
  max_watts: z.number().optional().nullable(),
  elev_high: z.number().optional().nullable(),
  elev_low: z.number().optional().nullable(),
  calories: z.number().optional().nullable(),
})

export type StravaAthlete = z.infer<typeof stravaUserSchema>
export const parseStravaAthlete = (data: unknown) =>
  stravaUserSchema.parse(data)

export type TokensSchema = z.infer<typeof tokenSchema>
export const parseTokenResponse = (data: unknown) => tokenSchema.parse(data)

export type Webhook = z.infer<typeof webhookSchema>
export const parseWebhook = (data: unknown) => webhookSchema.parse(data)

export type StravaActivity = z.infer<typeof stravaActivitySchema>
export const parseStravaActivity = (data: unknown) =>
  stravaActivitySchema.parse(data)

export const parseRefreshTokenResponse = (data: unknown) =>
  refreshTokenSchema.parse(data)
