/* eslint-disable no-console */
import { TRPCError } from '@trpc/server'
import { parseGenerationTaskResponse, type SongGenerationTask } from './schema'

export default function createMusicGenerationService(apiKey: string) {
  const requestSong = async (
    title: string, // 80 max
    style: string, // 200 max
    prompt: string, // 3000 max
    callBackUrl: string, // !!! ADD port from config later
    model: string = 'V3_5'
  ): Promise<SongGenerationTask> => {
    try {
      const response = await fetch(
        'https://apibox.erweima.ai/api/v1/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt,
            style,
            title,
            customMode: true,
            instrumental: false,
            model,
            callBackUrl, // Callback process has three stages: text (text generation), first (first track complete), complete (all tracks complete)
          }),
        }
      )

      const data = await response.json()

      return parseGenerationTaskResponse(data)
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'Unexpected error occured creating song generation request'
      )
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Music API failed to generate a new task',
      })
    }
  }

  return { requestSong }
}

export type SongGenerationService = ReturnType<
  typeof createMusicGenerationService
>
