import type { Trait } from '@server/entities/traits'
import type { Genre } from '@server/entities/genre'
import type { ActivityFull } from '@server/entities/activity'
import { updateMultipliersTraits } from './getTraitMultipliers'
import { updateMultipliersActivity } from './getActivityMultipliers'
import { getGenre } from './getGenre'

export type Multipliers = {
  complexityMultiplier: number
  energyMultiplier: number
  moodMultiplier: number
  tempoMultiplier: number
}

export type PromptData = {
  complexityMultiplier: number
  energyMultiplier: number
  genreBias: number
  genreId: number
  moodMultiplier: number
  tempoMultiplier: number
}
function getMultipliers(activity: ActivityFull, traits: Trait[]): Multipliers {
  const traitMultipliers = updateMultipliersTraits(traits)
  return updateMultipliersActivity(traitMultipliers, activity)
}

export function getPromptData(
  activity: ActivityFull,
  traits: Trait[]
): PromptData {
  const multipliers = getMultipliers(activity, traits)
  const genre = getGenre(traits)

  return { ...genre, ...multipliers }
}

export function generatePrompt(
  activity: ActivityFull,
  traits: Trait[],
  genres: Genre[]
) {
  const promptData = getPromptData(activity, traits)
  const activityName = activity.title ? activity.title : 'workout song'
  const genre = genres.find((g) => Number(g.id) === promptData.genreId)
  const genreText = genre ? genre.name : 'pick random'
  const genreMultiplierText = genre ? promptData.genreBias : 0
  const promptText = `Generate a workout song based on the following parameters:
  - **Complexity:** ${promptData.complexityMultiplier}
  - **Energy:** ${promptData.energyMultiplier}
  - **Mood:** ${promptData.moodMultiplier}
  - **Tempo:** ${promptData.tempoMultiplier}
  - **Genre:** ${genreText} (Multiplier: ${genreMultiplierText})
Ensure the song is engaging, motivating, and fits the workout intensity.`

  return { promt: promptText, style: genreText, title: activityName }
}
