import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  const genres = await db.selectFrom('genre').selectAll().execute()
  // This is not the way to do it. But it will save time until there is proper front end admin functionality for updating genres and  traits.
  await db
    .insertInto('trait')
    .values([
      {
        name: 'Energetic',
        complexityMultiplier: 1.2,
        energyMultiplier: 1.5,
        genreBias: 0.1,
        genreId: genres.find((g) => g.name === 'Rock')?.id,
        moodMultiplier: 1.3,
        tempoMultiplier: 1.4,
      },
      {
        name: 'Optimistic',
        complexityMultiplier: 1.1,
        energyMultiplier: 1.3,
        genreBias: 0.2,
        genreId: genres.find((g) => g.name === 'Pop')?.id,
        moodMultiplier: 1.5,
        tempoMultiplier: 1.2,
      },
      {
        name: 'Calm',
        complexityMultiplier: 1.0,
        energyMultiplier: 0.8,
        genreBias: 0.4,
        genreId: genres.find((g) => g.name === 'Classical')?.id,
        moodMultiplier: 1.2,
        tempoMultiplier: 0.9,
      },
      {
        name: 'Melancholic',
        complexityMultiplier: 1.3,
        energyMultiplier: 0.7,
        genreBias: 0.5,
        genreId: genres.find((g) => g.name === 'Blues')?.id,
        moodMultiplier: 1.4,
        tempoMultiplier: 0.8,
      },
      {
        name: 'Lively',
        complexityMultiplier: 1.4,
        energyMultiplier: 1.6,
        genreBias: 0.2,
        genreId: genres.find((g) => g.name === 'Lively')?.id,
        moodMultiplier: 1.6,
        tempoMultiplier: 1.5,
      },
      {
        name: 'Mellow',
        complexityMultiplier: 1.0,
        energyMultiplier: 0.9,
        genreBias: 0.3,
        genreId: genres.find((g) => g.name === 'Jazz')?.id,
        moodMultiplier: 1.1,
        tempoMultiplier: 1.0,
      },
      {
        name: 'Adventurous',
        complexityMultiplier: 1.2,
        energyMultiplier: 1.4,
        genreBias: 0.3,
        genreId: genres.find((g) => g.name === 'Country')?.id,
        moodMultiplier: 1.3,
        tempoMultiplier: 1.4,
      },
      {
        name: 'Uplifting',
        complexityMultiplier: 1.1,
        energyMultiplier: 1.5,
        genreBias: 0.4,
        genreId: genres.find((g) => g.name === 'R&B')?.id,
        moodMultiplier: 1.5,
        tempoMultiplier: 1.3,
      },
      {
        name: 'Romantic',
        complexityMultiplier: 1.2,
        energyMultiplier: 1.0,
        genreBias: 0.2,
        genreId: genres.find((g) => g.name === 'Jazz')?.id,
        moodMultiplier: 1.6,
        tempoMultiplier: 0.8,
      },
      {
        name: 'Mysterious',
        complexityMultiplier: 1.3,
        energyMultiplier: 1.0,
        genreBias: 0.3,
        genreId: genres.find((g) => g.name === 'Electronic')?.id,
        moodMultiplier: 1.4,
        tempoMultiplier: 1.1,
      },
    ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db
    .deleteFrom('trait')
    .where('name', 'in', [
      'Energetic',
      'Optimistic',
      'Calm',
      'Melancholic',
      'Mellow',
      'Adventurous',
      'Uplifting',
      'Romantic',
      'Mysterious',
    ])
    .execute()
}
