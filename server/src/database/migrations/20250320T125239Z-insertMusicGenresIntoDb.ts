import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db
    .insertInto('genre')
    .values([
      { name: 'Rock' },
      { name: 'Pop' },
      { name: 'Classical' },
      { name: 'Jazz' },
      { name: 'Blues' },
      { name: 'Electronic' },
      { name: 'Hip-hop' },
      { name: 'Reggae' },
      { name: 'Country' },
      { name: 'R&B' },
    ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db
    .deleteFrom('genre')
    .where('name', 'in', [
      'Rock',
      'Pop',
      'Classical',
      'Jazz',
      'Blues',
      'Electronic',
      'Hip-hop',
      'Reggae',
      'Country',
      'R&B',
    ])
    .execute()
}
