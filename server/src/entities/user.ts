import z from 'zod'
import type { Selectable } from 'kysely'
import { traitSchema, traitPublic } from './traits'

const userSchema = z.object({
  id: z.coerce.number().int().positive(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().trim().email().min(5).max(100).toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  traits: z.array(traitSchema),
  strava: z.object({
    accessToken: z.string().nullable().default(null),
    refreshToken: z.string().nullable().default(null),
  }),
})

export const userSignupSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    password: true,
    email: true,
  })
  .extend({
    traits: z.array(traitPublic),
  })

const userSigninSchema = userSchema.pick({ email: true, password: true })
const authUserSchema = userSchema.pick({ id: true })
const userInDb = userSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  password: true,
})

export type UserSignup = z.infer<typeof userSignupSchema>
export type ApplicationUser = z.infer<typeof userSchema>
export type UserSignin = z.infer<typeof userSigninSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type UserInDb = z.infer<typeof userInDb>

export const userKeysDb = Object.keys(userInDb.shape) as (keyof UserInDb)[]

export const userKeysAll = Object.keys(
  userSchema.shape
) as (keyof ApplicationUser)[]
export const userKeysPublic = ['id', 'firstName', 'lastName'] as const

export type UserPublic = Pick<
  Selectable<ApplicationUser>,
  (typeof userKeysPublic)[number]
>
