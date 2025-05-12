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
    getActivitiesByUserId(userId: number): Promise<Selectable<Activity>[]> {
      return db
        .selectFrom('activity')
        .selectAll()
        .where('activity.userId', '=', userId)
        .execute()
    },
    getActivityByOriginId(
      originId: string
    ): Promise<Selectable<Activity> | undefined> {
      return db
        .selectFrom('activity')
        .selectAll()
        .where('activity.originId', '=', originId)
        .executeTakeFirst()
    },
  }
}

export type ActivityRepository = ReturnType<typeof activityRepository>
