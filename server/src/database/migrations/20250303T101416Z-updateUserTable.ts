import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('genre')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedByDefaultAsIdentity()
    )
    .addColumn('name', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('trait')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('tempo_multiplier', 'numeric', (c) => c.notNull())
    .addColumn('mood_multiplier', 'numeric', (c) => c.notNull())
    .addColumn('energy_multiplier', 'numeric', (c) => c.notNull())
    .addColumn('complexity_multiplier', 'numeric', (c) => c.notNull())
    .addColumn('genre', 'integer', (c) => c.references('genre.id').notNull())
    .addColumn('genre_bias', 'numeric', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('user_traits')
    .addColumn('user_id', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('trait_id', 'integer', (c) => c.references('trait.id').notNull())
    .execute()

  await db.schema
    .createTable('strava_tokens')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedByDefaultAsIdentity()
    )
    .addColumn('access_token', 'text')
    .addColumn('refresh_token', 'text')
    .addColumn('user_id', 'integer', (c) => c.notNull())
    .execute()

  await db.schema
    .alterTable('user')
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('password', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('user')
    .dropColumn('email')
    .dropColumn('password')
    .execute()

  await db.schema.dropTable('strava_tokens').execute()
  await db.schema.dropTable('user_traits').execute()
  await db.schema.dropTable('traits').execute()
  await db.schema.dropTable('genre').execute()
}
