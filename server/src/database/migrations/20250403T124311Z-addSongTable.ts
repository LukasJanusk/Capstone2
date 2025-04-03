import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('song')
    .addColumn('id', 'integer', (c) =>
      c.generatedAlwaysAsIdentity().notNull().primaryKey()
    )
    .addColumn('userId', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('taskId', 'integer', (c) =>
      c.references('generation_task.id').notNull()
    )
    .addColumn('activityId', 'integer', (c) =>
      c.references('activity.id').notNull()
    )
    .addColumn('audio_url', 'text', (c) => c.notNull())
    .addColumn('image_url', 'text')
    .addColumn('prompt', 'text')
    .addColumn('title', 'text')
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('song').execute()
}
