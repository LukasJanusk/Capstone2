import type { ActivityFull } from '@server/entities/activity'
import { fakeActivity } from '@server/entities/tests/fakes'
import { caloriesUpdate } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

describe('caloriesUpdate', () => {
  it('updates multipliers based on calories, when it is low', () => {
    const staticActivityLowCal = {
      ...(fakeActivity({ type: 'static', calories: 200 }) as ActivityFull),
      id: 3,
    }

    const updated = caloriesUpdate(defaultMultipliers(), staticActivityLowCal)

    expect(updated).toEqual({
      complexityMultiplier: 0.9,
      energyMultiplier: 0.8,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on calories, when it is average', () => {
    const staticActivityAvgCal = {
      ...(fakeActivity({ type: 'static', calories: 435 }) as ActivityFull),
      id: 3,
    }

    const updated = caloriesUpdate(defaultMultipliers(), staticActivityAvgCal)

    expect(updated).toEqual({
      complexityMultiplier: 1.1,
      energyMultiplier: 1.1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on calories, when it is high', () => {
    const staticActivityHighCal = {
      ...(fakeActivity({ type: 'static', calories: 800 }) as ActivityFull),
      id: 3,
    }

    const updated = caloriesUpdate(defaultMultipliers(), staticActivityHighCal)

    expect(updated).toEqual({
      complexityMultiplier: 1.2,
      energyMultiplier: 1.2,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('returns unchanged multipliers when calories is null', () => {
    const multipliers = defaultMultipliers()
    const staticActivityNoCal = {
      ...(fakeActivity({ type: 'static', calories: null }) as ActivityFull),
      id: 3,
    }

    const updated = caloriesUpdate(multipliers, staticActivityNoCal)

    expect(updated).toEqual(multipliers)
  })
})
