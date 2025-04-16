/* eslint-disable no-console */

import config from '@server/config'
import type { Logger } from '@server/logger'
import {
  parseGenerationDetails,
  parseGenerationTaskResponse,
  type SongGenerationTask,
} from './schema'

type RequestSongParams = {
  prompt: string
  style?: string
  title?: string
  logger?: Logger
  callBackUrl?: string
  model?: string
}
export default function createMusicGenerationService(apiKey: string) {
  const requestSong = async ({
    prompt,
    style,
    title,
    logger,
    callBackUrl = `${config.publicDomain}/api/trpc/generator.storeGenerated`.trim(),
    model = 'V3_5',
  }: RequestSongParams): Promise<SongGenerationTask> => {
    const t = title || ''
    const s = style || ''
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
            style: s,
            title: t,
            customMode: false,
            instrumental: false,
            model,
            callBackUrl,
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
  const requestSongByTaskId = async (taskId: string, logger?: Logger) => {
    try {
      const response = await fetch(
        `https://apibox.erweima.ai/api/v1/generate/record-info?taskId=${taskId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )

      const data = await response.json()
      const generationDetails = parseGenerationDetails(data)
      logger?.info(generationDetails, 'Song generation task received')
      return generationDetails
    } catch (error) {
      logger?.error(error, 'Error occured requesting song generation')
      throw error
    }
  }

  return { requestSong, requestSongByTaskId }
}

export type SongGenerationService = ReturnType<
  typeof createMusicGenerationService
>
