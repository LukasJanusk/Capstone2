import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { traitRepository } from './traitRepository'
import { songRepository } from './songRepository'
import { activityRepository } from './activityRepository'
import { genreRepository } from './genreRepository'

export type RepositoryFactory = <T>(db: Database) => T

const repositories = {
  userRepository,
  traitRepository,
  songRepository,
  activityRepository,
  genreRepository,
}

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
