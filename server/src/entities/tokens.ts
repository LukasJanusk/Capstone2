import z from 'zod'

export const tokensSchema = z.object({
  id: z.number().int().positive(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.number().int().positive(),
  stravaUserId: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
})

export type StravaTokensApp = z.infer<typeof tokensSchema>
