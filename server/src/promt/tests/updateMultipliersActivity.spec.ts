import { fakeActivity } from '@server/entities/tests/fakes'
import { updateMultipliersActivity } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

it('updates multipliers of activity', () => {
  const activity = {
    ...fakeActivity({
      type: 'ride',
      cadence: 68,
      speedAverage: 12,
      distance: 12000,
      calories: 700,
      heartrate: 140,
    }),
    id: 1,
  }
  const multipliers = defaultMultipliers()
  const updated = updateMultipliersActivity(multipliers, activity)

  expect(updated).toEqual({
    complexityMultiplier: 1.19,
    energyMultiplier: 1.27,
    moodMultiplier: 1.08,
    tempoMultiplier: 0.98,
  })
})
