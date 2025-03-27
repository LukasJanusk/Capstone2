import type { Insertable, Selectable } from 'kysely'

import type { Database, Activity } from '../database'

export function activityRepository(db: Database) {
  return {
    async create(
      activity: Insertable<Activity>
    ): Promise<Selectable<Activity>> {
      return db
        .insertInto('activity')
        .values(activity)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}

export type ActivityRepository = ReturnType<typeof activityRepository>
