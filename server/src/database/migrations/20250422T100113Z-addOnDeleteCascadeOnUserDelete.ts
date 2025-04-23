import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('activity')
    .dropConstraint('activity_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('activity')
    .addForeignKeyConstraint('activity_user_id_fkey', ['user_id'], 'user', [
      'id',
    ])
    .onDelete('cascade')
    .execute()

  await db.schema
    .alterTable('generationTask')
    .dropConstraint('generation_task_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('generationTask')
    .addForeignKeyConstraint(
      'generation_task_user_id_fkey',
      ['user_id'],
      'user',
      ['id']
    )
    .onDelete('cascade')
    .execute()

  await db.schema
    .alterTable('song')
    .dropConstraint('song_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('song')
    .addForeignKeyConstraint('song_user_id_fkey', ['user_id'], 'user', ['id'])
    .onDelete('cascade')
    .execute()

  await db.schema
    .alterTable('stravaTokens')
    .addForeignKeyConstraint(
      'strava_tokens_user_id_fkey',
      ['user_id'],
      'user',
      ['id']
    )
    .onDelete('cascade')
    .execute()

  await db.schema
    .alterTable('userTraits')
    .dropConstraint('user_traits_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('userTraits')
    .addForeignKeyConstraint('user_traits_user_id_fkey', ['user_id'], 'user', [
      'id',
    ])
    .onDelete('cascade')
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('activity')
    .dropConstraint('activity_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('activity')
    .addForeignKeyConstraint('activity_user_id_fkey', ['user_id'], 'user', [
      'id',
    ])
    .execute()

  await db.schema
    .alterTable('generationTask')
    .dropConstraint('generation_task_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('generationTask')
    .addForeignKeyConstraint(
      'generation_task_user_id_fkey',
      ['user_id'],
      'user',
      ['id']
    )
    .execute()

  await db.schema
    .alterTable('song')
    .dropConstraint('song_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('song')
    .addForeignKeyConstraint('song_user_id_fkey', ['user_id'], 'user', ['id'])
    .execute()

  await db.schema
    .alterTable('stravaTokens')
    .addForeignKeyConstraint(
      'strava_tokens_user_id_fkey',
      ['user_id'],
      'user',
      ['id']
    )
    .execute()

  await db.schema
    .alterTable('userTraits')
    .dropConstraint('user_traits_user_id_fkey')
    .execute()
  await db.schema
    .alterTable('userTraits')
    .addForeignKeyConstraint('user_traits_user_id_fkey', ['user_id'], 'user', [
      'id',
    ])
    .execute()
}
