import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('strava_tokens')
    .alterColumn('access_token', (c) => c.setNotNull())
    .alterColumn('refresh_token', (c) => c.setNotNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('strava_tokens')
    .alterColumn('access_token', (c) => c.dropNotNull())
    .alterColumn('refresh_token', (c) => c.dropNotNull())
    .execute()
}
