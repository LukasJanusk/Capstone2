import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import getPulbicUser from './getPulbicUser'
import changeEmail from './changeEmail'

export default router({ signup, login, getPulbicUser, changeEmail })
