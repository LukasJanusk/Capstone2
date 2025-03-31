import type { Selectable } from 'kysely'

import type { Database, Genre } from '../database'

export function genreRepository(db: Database) {
  return {
    async getAll(): Promise<Selectable<Genre>[]> {
      return db.selectFrom('genre').selectAll().execute()
    },
  }
}

export type GenreRepository = ReturnType<typeof genreRepository>
