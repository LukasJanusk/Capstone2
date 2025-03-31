import z from 'zod'

const genreSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(100),
})

export type Genre = z.infer<typeof genreSchema>
export const parseGenre = (data: unknown) => genreSchema.parse(data)
