import { TRPCError } from '@trpc/server'
import { parseResponse, type Song } from './schema'

export default function createTopmediaiService(apiKey: string) {
  const getSongs = async (
    prompt: string,
    lyrics?: string,
    title?: string
  ): Promise<Song[]> => {
    let isAuto = 0
    if (lyrics && title) isAuto = 1

    const response = await fetch('https://api.topmediai.com/v1/music', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        is_auto: isAuto,
        prompt,
        lyrics,
        title,
        instrumental: 0,
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.statusText}`)
    }
    const data = await response.json()
    if (!data)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'API call failed' })
    const parsed = parseResponse(data).data

    return parsed
  }
  return { getSongs }
}

export type TopmediaiService = ReturnType<typeof createTopmediaiService>
