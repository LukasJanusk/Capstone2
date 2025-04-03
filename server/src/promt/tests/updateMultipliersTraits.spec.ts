import { fakeTrait } from '@server/entities/tests/fakes'
import { updateMultipliersTraits } from '../getTraitMultipliers'

it('updates trait Multipliers', () => {
  const traits = [
    {
      id: 1,
      ...fakeTrait({
        complexityMultiplier: 1,
        energyMultiplier: 1.25,
        moodMultiplier: 1.4,
        tempoMultiplier: 1,
      }),
    },
    {
      id: 2,
      ...fakeTrait({
        complexityMultiplier: 1.5,
        energyMultiplier: 1.2,
        moodMultiplier: 0.8,
        tempoMultiplier: 1.1,
      }),
    },
    {
      id: 3,
      ...fakeTrait({
        complexityMultiplier: 2,
        energyMultiplier: 1,
        moodMultiplier: 1.1,
        tempoMultiplier: 1.1,
      }),
    },
  ]

  const updated = updateMultipliersTraits(traits)

  expect(updated).toEqual({
    complexityMultiplier: 3,
    energyMultiplier: 1.5,
    moodMultiplier: 1.23,
    tempoMultiplier: 1.21,
  })
})
