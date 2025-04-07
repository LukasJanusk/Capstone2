import z from 'zod'

const generationTaskSchema = z.object({
  code: z.number().int().positive(),
  msg: z.string(),
  data: z.object({ task_id: z.string() }).optional().nullable(),
})

export const parseGenerationTaskResponse = (data: unknown) =>
  generationTaskSchema.parse(data)

export const songItemSchema = z
  .object({
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
  .transform((s) => ({
    id: s.id,
    audioUrl: s.audio_url,
    sourceAudioUrl: s.source_audio_url,
    streamAudioUrl: s.stream_audio_url,
    sourceStreamAudioUrl: s.source_stream_audio_url,
    imageUrl: s.image_url,
    sourceImageUrl: s.source_image_url,
    prompt: s.prompt,
    modelName: s.model_name,
    title: s.title,
    tags: s.tags,
    createTime: s.createTime,
    duration: s.duration,
  }))

const callbackDataSchema = z
  .object({
    callbackType: z.string(),
    task_id: z.string(),
    data: z.array(songItemSchema).optional().nullable(),
  })
  .transform((d) => ({
    callbackType: d.callbackType,
    taskId: d.task_id,
    data: d.data,
  }))

export const callbackSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: callbackDataSchema,
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
