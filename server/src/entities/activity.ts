import z from 'zod'
import { songPublicSchema } from './song'

export const activitySchema = z.object({
  id: z.coerce.number().positive().int(),
  userId: z.coerce.number().positive().int(),
  type: z.enum(['ride', 'static', 'run']).default('static'),
  origin: z.string().default('strava'),
  originId: z.string().nullable(),
  title: z.string().max(100).nullable(),
  duration: z.coerce.number(), // Low 20 min, Average 40 min, Long 60+ min
  heartrate: z.coerce.number().nullable(), // Low HR: 95-133 bpm, Mid HR: 133-162 bpm, High HR: 162-190 bpm
  calories: z.coerce.number().nullable(),
  speedAverage: z.coerce.number().nullable(), // Low Speed: 16-24 km/h, Average Speed: 24-32 km/h, High Speed: 32-48+ km/h
  distance: z.coerce.number().nullable(),
  cadence: z.coerce.number().nullable(), // Low Cadence: 50-70 RPM, Average Cadence: 70-90 RPM, High Cadence: 90-110+ RPM
  startTime: z.string(),
})
export const activitySchemaPublic = activitySchema.pick({
  id: true,
  type: true,
  title: true,
  duration: true,
  heartrate: true,
  calories: true,
  speedAverage: true,
  distance: true,
  cadence: true,
  startTime: true,
})
export const activityWithSongSchema = z.object({
  activity: activitySchemaPublic,
  songs: z.array(songPublicSchema),
})
export type ActivityFull = z.infer<typeof activitySchema>
export type ActivityPublic = z.infer<typeof activitySchemaPublic>
export const parseActivity = (data: unknown) => activitySchema.parse(data)
export type ActivityWithSong = z.infer<typeof activityWithSongSchema>
