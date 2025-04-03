import type { Trait } from '@server/entities/traits'

export function updateMultipliersTraits(traits: Trait[]) {
  const multiplier = {
    complexityMultiplier: 1,
    energyMultiplier: 1,
    moodMultiplier: 1,
    tempoMultiplier: 1,
  }
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
  return {
    complexityMultiplier: parseFloat(
      multiplier.complexityMultiplier.toFixed(2)
    ),
    energyMultiplier: parseFloat(multiplier.energyMultiplier.toFixed(2)),
    moodMultiplier: parseFloat(multiplier.moodMultiplier.toFixed(2)),
    tempoMultiplier: parseFloat(multiplier.tempoMultiplier.toFixed(2)),
  }
}
