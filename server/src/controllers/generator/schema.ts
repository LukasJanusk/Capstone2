import z from 'zod'

const generationTaskSchema = z.object({
  code: z.number().int().positive(),
  msg: z.string(),
  data: z.object({ taskId: z.string() }).optional().nullable(),
})

export const parseGenerationTaskResponse = (data: unknown) =>
  generationTaskSchema.parse(data)
