import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import { logger } from './logger'

const database = createDatabase(config.database)
logger.info('Database service created')
const app = createApp(database)

app.listen(config.port, () => {
  logger.info(`Server is running at http://localhost:${config.port}`)
})
