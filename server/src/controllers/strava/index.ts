import { router } from '@server/trpc'
import getAccess from './getAccess'
import webhooks from './webhooks'
import getClientId from './getClientId'

export default router({ getAccess, webhooks, getClientId })
