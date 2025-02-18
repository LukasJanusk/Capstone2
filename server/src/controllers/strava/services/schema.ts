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

export const webhookSchema = z.object({
  aspect_type: z.enum(['update', 'create', 'delete']),
  event_time: z.coerce.number().int().positive(),
  object_id: z.coerce.number().int().positive(),
  object_type: z.enum(['activity', 'athlete']),
  owner_id: z.coerce.number().int().positive(),
  subscription_id: z.coerce.number().int().positive(),
  updates: z.record(z.unknown()),
})

export type StravaAthlete = z.infer<typeof stravaUserSchema>
export const parseStravaAthlete = (data: unknown) =>
  stravaUserSchema.parse(data)

export type TokensSchema = z.infer<typeof tokenSchema>
export const parseTokenResponse = (data: unknown) => tokenSchema.parse(data)

export type Webhook = z.infer<typeof webhookSchema>
export const parseWebhook = (data: unknown) => webhookSchema.parse(data)
