import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  db.schema
    .createTable('generation_task')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('userId', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('taskId', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  db.schema.dropTable('generation_task')
}
