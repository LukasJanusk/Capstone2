import z from 'zod'
import { songSchema } from './song'

export const activitySchema = z.object({
  id: z.coerce.number().positive().int(),
  userId: z.coerce.number().positive().int(),
  type: z.enum(['ride', 'static', 'run']).default('static'),
  origin: z.string().min(1).max(100).default('strava'),
  originId: z.coerce.number().min(1).optional(),
  title: z.string().min(1).max(100),
  duration: z.coerce.number().positive(), // Low 20 min, Average 40 min, Long 60+ min
  heartrate: z.coerce.number().int().positive().nullable().optional(), // Low HR: 95-133 bpm, Mid HR: 133-162 bpm, High HR: 162-190 bpm
  calories: z.coerce.number().int().positive().nullable().optional(),
  speedAverage: z.coerce.number().positive().nullable().optional(), // Low Speed: 16-24 km/h, Average Speed: 24-32 km/h, High Speed: 32-48+ km/h
  distance: z.coerce.number().positive().nullable().optional(),
  cadence: z.coerce.number().positive().nullable().optional(), // Low Cadence: 50-70 RPM, Average Cadence: 70-90 RPM, High Cadence: 90-110+ RPM
  startTime: z.string(),
})
export const activityWithSongSchema = z.object({
  activity: activitySchema,
  songs: z.array(songSchema),
})
export type ActivityFull = z.infer<typeof activitySchema>
export const parseActivity = (data: unknown) => activitySchema.parse(data)
export type ActivityWithSong = z.infer<typeof activityWithSongSchema>
