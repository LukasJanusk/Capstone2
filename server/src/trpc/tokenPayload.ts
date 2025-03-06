import { type AuthUser, authUserSchema } from '@server/entities/user'
import z from 'zod'

export const payloadSchema = z.object({
  user: authUserSchema,
})

type TokenPayload = z.infer<typeof payloadSchema>

export function prepareTokenPayload(user: AuthUser): TokenPayload {
  return payloadSchema.parse({ user })
}

export function parseTokenPayload(tokenVerified: unknown): TokenPayload {
  return payloadSchema.parse(tokenVerified)
}
