import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('generation_task')
    .addColumn('activityId', 'integer', (c) =>
      c.references('activity.id').notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('generation_task')
    .dropColumn('activityId')
    .execute()
}
