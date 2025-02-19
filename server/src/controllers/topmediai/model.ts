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
    console.log('response from api received')
    const data = await response.json()
    console.log(data.message)
    const parsed = parseResponse(data).data
    console.log(`parsed now returning: ${parsed}`)

    return parsed
  }
  return { getSongs }
}

export type TopmediaiService = ReturnType<typeof createTopmediaiService>
