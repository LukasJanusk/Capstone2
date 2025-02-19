import z from 'zod'

const songSchema = z.object({
  audio_file: z.string().url(),
  image_file: z.string().url(),
  item_uuid: z.string(),
  title: z.string().optional().nullable(),
  lyric: z.string().optional().nullable(),
  tags: z.string(),
})

const songResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(songSchema),
})

export type Song = z.infer<typeof songSchema>
export type SongResponseSchema = z.infer<typeof songResponseSchema>

export const parseResponse = (data: unknown) => songResponseSchema.parse(data)
