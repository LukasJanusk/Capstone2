import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  db.schema
    .alterTable('song')
    .addColumn('origin_id', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  db.schema.alterTable('song').dropColumn('origin_id').execute()
}
