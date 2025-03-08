import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('strava_tokens')
    .addColumn('strava_user_id', 'integer', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  db.schema.alterTable('strava_tokens').dropColumn('strava_user_id').execute()
}
