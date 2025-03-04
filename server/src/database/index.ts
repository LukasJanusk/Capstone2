import {
  CamelCasePlugin,
  Kysely,
  ParseJSONResultsPlugin,
  PostgresDialect,
} from 'kysely'
import pg from 'pg'
import type { DB } from './types'

// Set the custom type parser for `numeric` to parse it as a float.
pg.types.setTypeParser(1700, (val) => parseFloat(val))

export function createDatabase(options: pg.PoolConfig): Kysely<DB> {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new pg.Pool(options),
    }),
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  })
}

export type Database = Kysely<DB>
export type DatabasePartial<T> = Kysely<T>
export * from './types'
