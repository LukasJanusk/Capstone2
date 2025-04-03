import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  db.schema
    .createTable('activity')
    .addColumn('id', 'integer', (c) =>
      c.generatedAlwaysAsIdentity().notNull().primaryKey()
    )
    .addColumn('user_id', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('origin', 'text', (c) => c.notNull())
    .addColumn('origin_id', 'integer', (c) => c.notNull())
    .addColumn('type', 'text', (c) => c.notNull())
    .addColumn('start_time', 'text', (c) => c.notNull())
    .addColumn('title', 'text')
    .addColumn('duration', 'float4')
    .addColumn('heartrate', 'float4')
    .addColumn('calories', 'float4')
    .addColumn('speed_average', 'float4')
    .addColumn('distance', 'float4')
    .addColumn('cadence', 'float4')
    .execute()
}

export async function down(db: Kysely<any>) {
  db.schema.dropTable('activity')
}
