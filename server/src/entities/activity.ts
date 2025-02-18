import z from 'zod'

const activitySchema = z.object({
  id: z.coerce.number().positive().int(),
  userId: z.coerce.number().positive().int(),
  type: z.enum(['ride', 'static', 'run']),
  origin: z.string().min(1).max(100),
  originId: z.string().min(1).max(100).optional(),
  originOwnerId: z.coerce.string().min(1).max(100).optional(),
  title: z.string().min(1).max(100),
  duration: z.coerce.number().positive(),
  heartrate: z.coerce.number().int().positive().nullable().optional(),
  calories: z.coerce.number().int().positive(),
  elevationGain: z.coerce.number().int().positive().nullable().optional(),
  power: z.coerce.number().int().positive().nullable().optional(),
  powerMax: z.coerce.number().positive().nullable().optional(),
  speedAverage: z.coerce.number().positive().nullable().optional(),
  speedMax: z.coerce.number().positive().nullable().optional(),
  cadence: z.coerce.number().positive(),
  startTime: z.coerce.date(),
})

export type ActivityFull = z.infer<typeof activitySchema>
