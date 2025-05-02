import z from 'zod'

const generationTaskSchema = z.object({
  code: z.number().int().positive(),
  msg: z.string(),
  data: z.object({ taskId: z.string() }).optional().nullable(),
})

export const parseGenerationTaskResponse = (data: unknown) =>
  generationTaskSchema.parse(data)

export const songItemSchema = z.object({
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

const callbackDataSchema = z.object({
  callbackType: z.string(),
  task_id: z.string(),
  data: z.array(songItemSchema).optional().nullable(),
})

export const callbackSchema = z.object({
  code: z.coerce.number(),
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

const sunoDataItemSchema = z.object({
  id: z.coerce.string(),
  audioUrl: z.string().url(),
  streamAudioUrl: z.string().url(),
  imageUrl: z.string().url().nullable(),
  prompt: z.string(),
  modelName: z.string(),
  title: z.string(),
  tags: z.string().nullable(),
  duration: z.number(),
})

const songGenerationResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    taskId: z.string(),
    parentMusicId: z.string(),
    param: z.string(),
    response: z.object({
      taskId: z.string(),
      sunoData: z.array(sunoDataItemSchema).nullable(),
    }),
    status: z.string(),
    type: z.string(),
    errorCode: z.number().nullable(),
    errorMessage: z.string().nullable(),
  }),
})

export const parseSongResponse = (data: unknown) => responseSchema.parse(data)
export type SongGenerationTask = z.infer<typeof generationTaskSchema>
export const parseGenerationDetails = (data: unknown) =>
  songGenerationResponseSchema.parse(data)
export type SongGenerationDetails = z.infer<typeof songGenerationResponseSchema>
type RawCallbackData = z.infer<typeof callbackSchema>['data']

export const transformSongCallbackData = (data: RawCallbackData) => ({
  callbackType: data.callbackType,
  taskId: data.task_id,
  data: data.data?.map((song) => ({
    originId: song.id,
    audioUrl: song.audio_url,
    imageUrl: song.image_url,
    prompt: song.prompt,
    title: song.title,
  })),
})
export type ParsedSongData = ReturnType<typeof transformSongCallbackData>
