import z from 'zod'

const songSchema = z.object({
  audio_file: z.string().url(),
  image_file: z.string().url(),
  item_uuid: z.string(),
  title: z.string().optional().nullable(),
  lyric: z.string().optional().nullable(),
  tags: z.string(),
})

export type Song = z.infer<typeof songSchema>
