import { router } from '@server/trpc'
import getAccess from './getAccess'
import webhooks from './webhooks'
import getAthlete from './getAthlete'
import getClientId from './getClientId'

export default router({ getAccess, getAthlete, webhooks, getClientId })
