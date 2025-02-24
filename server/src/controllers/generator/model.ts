/* eslint-disable no-console */
import { type MusicGenerationService } from '@server/entities/services/MusicGenerationService'
import { parseGenerationTaskResponse } from './schema'

export default function createMusicGenerationService(
  apiKey: string
): MusicGenerationService {
  const getSongs = async (
    title: string, // 80 max
    style: string, // 200 max
    prompt: string, // 3000 max
    model: string = 'V3_5',
    callBackUrl: string = 'url' // add port from config later
  ): Promise<string> => {
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
      const parsed = parseGenerationTaskResponse(data)

      if (parsed.data && parsed.data.taskId) return parsed.data.taskId
      throw new Error('Failed to start start Song generation')
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'Unexpected error occured creating song generation request'
      )
      throw error
    }
  }

  return { getSongs }
}
