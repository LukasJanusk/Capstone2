import 'dotenv/config'

export const apiOrigin = (process.env.VITE_API_ORIGIN as string) || 'http://localhost:3000'
export const apiPath = (process.env.VITE_API_PATH as string) || '/api/trpc'

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
