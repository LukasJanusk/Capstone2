import { router } from '@server/trpc'
import getAccess from './getAccess'
import webhooks from './webhooks'

export default router({ getAccess, webhooks })
