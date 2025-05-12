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
    async getGenerationTaskByUserId(
      userId: number
    ): Promise<Selectable<GenerationTask>[]> {
      return db
        .selectFrom('generationTask')
        .selectAll()
        .where('generationTask.userId', '=', userId)
        .execute()
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
        .selectAll()
        .where('song.userId', '=', userId)
        .execute()
    },
  }
}

export type SongRepository = ReturnType<typeof songRepository>
