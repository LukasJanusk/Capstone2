import type { Insertable, Selectable } from 'kysely'

import type { Database, GenerationTask, Song } from '../database'

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
    async getByTaskId(taskId: string): Promise<Selectable<GenerationTask>> {
      return db
        .selectFrom('generationTask')
        .where('generationTask.taskId', '=', taskId)
        .selectAll()
        .executeTakeFirstOrThrow()
    },
    async createSong(
      song: Insertable<Song> | Insertable<Song>[]
    ): Promise<Selectable<Song>[]> {
      return db.insertInto('song').values(song).returningAll().execute()
    },
    async getSongByUserId(userId: number): Promise<Selectable<Song>[]> {
      return db
        .selectFrom('song')
        .where('song.userId', '=', userId)
        .selectAll()
        .execute()
    },
  }
}

export type SongRepository = ReturnType<typeof songRepository>
