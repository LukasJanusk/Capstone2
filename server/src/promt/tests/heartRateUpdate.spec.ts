import { fakeActivity } from '@server/entities/tests/fakes'
import type { ActivityFull } from '@server/entities/activity'
import { heartRateUpdate } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

describe('heartRateUpdate', () => {
  it('updates multipliers based on heartrate, when it is low', () => {
    const staticActivityLowHr = {
      ...fakeActivity({ type: 'static', heartrate: 80 }),
      id: 3,
    }

    const updated = heartRateUpdate(defaultMultipliers(), staticActivityLowHr)

    expect(updated).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 0.8,
      moodMultiplier: 0.9,
      tempoMultiplier: 0.8,
    })
  })
  it('updates multipliers based on heartrate, when it is average', () => {
    const staticActivityMidHr = {
      ...fakeActivity({ type: 'static', heartrate: 145 }),
      id: 3,
    }

    const updated = heartRateUpdate(defaultMultipliers(), staticActivityMidHr)

    expect(updated).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on heartrate, when it is high', () => {
    const staticActivityHighHr = {
      ...fakeActivity({ type: 'static', heartrate: 174 }),
      id: 3,
    }

    const updated = heartRateUpdate(defaultMultipliers(), staticActivityHighHr)

    expect(updated).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.2,
      moodMultiplier: 1.2,
      tempoMultiplier: 1.4,
    })
  })
  it('returns unchanged multipliers when activity heartrate is null', () => {
    const activityNoHr = {
      ...(fakeActivity({ type: 'static', heartrate: null }) as ActivityFull),
      id: 3,
    }
    const multipliers = defaultMultipliers()
    const unupdated = heartRateUpdate(multipliers, activityNoHr)

    expect(unupdated).toEqual(multipliers)
  })
})
