import config from '@server/config'
import { createDatabase } from '@server/database'

// TODO: Make separate database for tests later?

/**
 * Creates a test database instance. In this case, it is the same as the
 * main database instance.
 */
export const createTestDatabase = () => createDatabase(config.database)
