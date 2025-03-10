import { router } from '@server/trpc'
import getAccess from './getAccess'
import webhooks from './webhooks'
import getAthlete from './getAthlete'

export default router({ getAccess, getAthlete, webhooks })
