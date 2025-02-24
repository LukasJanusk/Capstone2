import z from 'zod'
import { traitSchema } from './traits'

const userSchema = z.object({
  id: z.coerce.number().int().positive(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().min(5).max(100).toLowerCase(),
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
})
const userPublicSchema = userSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
})
const userSignupSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  password: true,
  email: true,
})
const userSigninSchema = userSchema.pick({ email: true, password: true })
const authUserSchema = userSchema.pick({ id: true })

export type UserSignup = z.infer<typeof userSignupSchema>
export type UserPublic = z.infer<typeof userPublicSchema>
export type ApplicationUser = z.infer<typeof userSchema>
export type UserSignin = z.infer<typeof userSigninSchema>
export type AuthUser = z.infer<typeof authUserSchema>
