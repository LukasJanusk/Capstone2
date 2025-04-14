import { publicProcedure } from '@server/trpc'
import config from '@server/config'

export default publicProcedure.query(async () => config.stravaClientId)
