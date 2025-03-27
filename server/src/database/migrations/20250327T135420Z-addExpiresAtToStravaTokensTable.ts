import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  db.schema
    .alterTable('strava_tokens')
    .addColumn('expires_at', 'integer', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  db.schema.alterTable('strava_tokens').dropColumn('expires_at').execute()
}
