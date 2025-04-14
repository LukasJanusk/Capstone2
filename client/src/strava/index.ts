import { trpc } from '@/trpc'
import { setError, parseErrorMessage } from '@/errors'

export const authorizeUser = async (clientId: string | undefined | null) => {
  try {
    if (!clientId) {
      clientId = await trpc.strava.getClientId.query()
    }
    const currentUrl = window.location.href
    const redirectUrl = currentUrl + 'authenticated'
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}/&approval_prompt=force&scope=read,activity:read_all`
    window.location.href = authUrl
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
