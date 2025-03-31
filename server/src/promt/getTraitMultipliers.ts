import { omit } from 'lodash'
import type { Trait } from '@server/entities/traits'

export const defaultMultipliers = {
  complexityMultiplier: 1,
  energyMultiplier: 1,
  genreBias: 1,
  genreId: null,
  moodMultiplier: 1,
  tempoMultiplier: 1,
}

export function updateMultipliersTraits(traits: Trait[]) {
  const multiplier = { ...omit(defaultMultipliers, ['genreBias', 'genreId']) }
  traits.forEach((t) =>
    Object.keys(t).forEach((key) => {
      if (key in multiplier) {
        const typedKey = key as keyof typeof multiplier
        if (
          typeof multiplier[typedKey] === 'number' &&
          typeof t[typedKey] === 'number'
        ) {
          multiplier[typedKey] *= t[typedKey] as number
        }
      }
    })
  )
  return multiplier
}
