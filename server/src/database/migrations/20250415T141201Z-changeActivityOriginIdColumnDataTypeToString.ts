import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('activity')
    .alterColumn('originId', (c) => c.setDataType('text'))
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('activity')
    .alterColumn('originId', (c) => c.setDataType('integer'))
    .execute()
}
