import type { Insertable, Selectable } from 'kysely'

import type { Database, GenerationTask } from '../database'

export function songRepository(db: Database) {
  return {
    async createGenerationTask(
      generationTask: Insertable<GenerationTask>
    ): Promise<Selectable<GenerationTask>> {
      return db
        .insertInto('generationTask')
        .values(generationTask)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}

export type SongRepository = ReturnType<typeof songRepository>
