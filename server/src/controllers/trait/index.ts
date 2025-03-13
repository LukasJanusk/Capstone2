import { router } from '@server/trpc'
import getAll from './getAll'

// TODO: Add routes for creating, updating, deleting trait
export default router({ getAll })
