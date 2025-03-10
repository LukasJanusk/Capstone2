import type { Database, Trait } from '@server/database'
import { type TraitPublic, traitKeysPublic } from '@server/entities/traits'
import type { Insertable, Selectable } from 'kysely'

export function traitRepository(db: Database) {
  return {
    async create(trait: Insertable<Trait>): Promise<TraitPublic> {
      return db
        .insertInto('trait')
        .values(trait)
        .returning(traitKeysPublic)
        .executeTakeFirstOrThrow()
    },
    async getAllPublic(): Promise<TraitPublic[]> {
      return db.selectFrom('trait').select(traitKeysPublic).execute()
    },
    async findByIdPublic(id: number): Promise<TraitPublic> {
      return db
        .selectFrom('trait')
        .select(traitKeysPublic)
        .where('trait.id', '=', id)
        .executeTakeFirstOrThrow()
    },
    async findByIdFull(id: number): Promise<Selectable<Trait>> {
      return db
        .selectFrom('trait')
        .selectAll()
        .where('trait.id', '=', id)
        .executeTakeFirstOrThrow()
    },
  }
}

export type TraitRepository = ReturnType<typeof traitRepository>
