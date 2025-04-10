import z from 'zod'

export const songSchema = z.object({
  id: z.number().int().positive(),
  originId: z.string(),
  audioUrl: z.string().url(),
  imageUrl: z.string().url().optional().nullable(),
  taskId: z.number().int().positive(),
  activityId: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
})
export const songPublicSchema = songSchema.pick({
  id: true,
  audioUrl: true,
  imageUrl: true,
  title: true,
})
export type Song = z.infer<typeof songSchema>
export type SongPublic = z.infer<typeof songPublicSchema>
export const parseSong = (data: unknown) => songSchema.parse(data)
