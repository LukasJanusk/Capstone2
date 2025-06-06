import { router } from '@server/trpc'
import signup from './signup'
import login from './login'
import getPulbicUser from './getPulbicUser'
import changeEmail from './changeEmail'
import getUserActivitiesWithSongs from './getUserActivitiesWithSongs'
import stravaAuthenticated from './stravaAuthenticated'
import deleteUser from './deleteUser'

export default router({
  signup,
  login,
  getPulbicUser,
  changeEmail,
  getUserActivitiesWithSongs,
  stravaAuthenticated,
  deleteUser,
})
