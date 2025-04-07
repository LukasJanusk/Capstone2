import z from 'zod'

export const songSchema = z.object({
  audioUrl: z.string().url(),
  imageUrl: z.string().url().optional().nullable(),
  taskId: z.number().int().positive(),
  activityId: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
})
export type Song = z.infer<typeof songSchema>
export const parseSong = (data: unknown) => songSchema.parse(data)
