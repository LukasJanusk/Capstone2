import z from 'zod'

const traitSchema = z.object({ id: z.number(), name: z.string() })
export const schema = z.object({
  firstName: z
    .string()
    .min(1, 'Must be 1 to 100 characters long')
    .max(100, 'Must be 1 to 100 characters long'),
  lastName: z
    .string()
    .min(1, 'Must be 1 to 100 characters long')
    .max(100, 'Must be 1 to 100 characters long'),
  email: z.string().trim().email('Invalid email').toLowerCase(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\\[\]{}|;:'",.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\\[\]{}|;:'",.<>/?]{8,64}$/,
      'Password must be at least 8 characters long, contain a capital letter, a number and a symbol'
    ),
  traits: z.array(traitSchema).min(3, 'Must provide at least 3 traits'),
})
export const signInSchema = schema.pick({ email: true, password: true })
export type SignUpSchema = z.infer<typeof schema>
export type SignInSchema = z.infer<typeof signInSchema>
