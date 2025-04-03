import z from 'zod'

const songSchema = z.object({
  audioUrl: z.string().url(),
  imageUrl: z.string().url().optional().nullable(),
  taskId: z.number().int().positive(),
  activityId: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
})
// activityId: number
// audioUrl: string
// id: Generated<number>
// imageUrl: string | null
// prompt: string | null
// taskId: number
// title: string | null
// userId: number
export type Song = z.infer<typeof songSchema>
export const parseSong = (data: unknown) => songSchema.parse(data)
