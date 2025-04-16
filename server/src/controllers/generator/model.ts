/* eslint-disable no-console */

import config from '@server/config'
import type { Logger } from '@server/logger'
import { parseGenerationTaskResponse, type SongGenerationTask } from './schema'

export default function createMusicGenerationService(apiKey: string) {
  const requestSong = async (
    title: string, // 80 max
    style: string, // 200 max
    prompt: string, // 3000 max
    logger?: Logger,
    callBackUrl = `${config.publicDomain}/api/trpc/generator.storeGenerated`,
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
      const parsedGenerationTask = parseGenerationTaskResponse(data)
      logger?.info(parsedGenerationTask, 'Song generation task received')
      return parsedGenerationTask
    } catch (error) {
      logger?.error(error, 'Error occured requesting song generation')
      throw error
    }
  }

  return { requestSong }
}

export type SongGenerationService = ReturnType<
  typeof createMusicGenerationService
>
