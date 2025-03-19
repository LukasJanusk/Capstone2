import z from 'zod'

const generationTaskSchema = z.object({
  code: z.number().int().positive(),
  msg: z.string(),
  data: z.object({ task_id: z.string() }).optional().nullable(),
})

export const parseGenerationTaskResponse = (data: unknown) =>
  generationTaskSchema.parse(data)

const songItemSchema = z.object({
  id: z.string(),
  audio_url: z.string().url(),
  source_audio_url: z.string().url(),
  stream_audio_url: z.string().url(),
  source_stream_audio_url: z.string().url().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  source_image_url: z.string().url().optional().nullable(),
  prompt: z.string().optional().nullable(),
  model_name: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  createTime: z.string(),
  duration: z.number(),
})

const responseSchema = z.object({
  code: z.coerce.number(),
  msg: z.string(),
  data: z.object({
    callbackType: z.string(),
    taskId: z.string(),
    data: z.array(songItemSchema),
  }),
})

export const parseSongResponse = (data: unknown) => responseSchema.parse(data)
export type SongGenerationTask = z.infer<typeof generationTaskSchema>
