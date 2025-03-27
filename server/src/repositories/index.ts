import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { traitRepository } from './traitRepository'
import { songRepository } from './songRepository'
import { activityRepository } from './activityRepository'

export type RepositoryFactory = <T>(db: Database) => T

const repositories = {
  userRepository,
  traitRepository,
  songRepository,
  activityRepository,
}

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
