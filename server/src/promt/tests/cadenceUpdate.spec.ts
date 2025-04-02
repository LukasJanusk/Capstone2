import type { ActivityFull } from '@server/entities/activity'
import { fakeActivity } from '../../entities/tests/fakes'

import { cadenceUpdate } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

describe('cadenceUpdate', () => {
  it('updates multipliers based on cadence, wehn cadence is low', () => {
    const rideActivityLowCadence = {
      ...fakeActivity({ type: 'ride', cadence: 68 }),
      id: 1,
    }
    const update = cadenceUpdate(defaultMultipliers(), rideActivityLowCadence)

    expect(update).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 0.8,
      moodMultiplier: 0.9,
      tempoMultiplier: 0.7,
    })
  })
  it('updates multipliers based on cadence, wehn cadence is average', () => {
    const rideActivityMidCadence = {
      ...fakeActivity({ type: 'ride', cadence: 85 }),
      id: 1,
    }
    const update = cadenceUpdate(defaultMultipliers(), rideActivityMidCadence)

    expect(update).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.1,
      moodMultiplier: 1.1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on cadence, wehn cadence is high', () => {
    const rideActivityHighCadence = {
      ...fakeActivity({ type: 'ride', cadence: 130 }),
      id: 1,
    }
    const update = cadenceUpdate(defaultMultipliers(), rideActivityHighCadence)

    expect(update).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.2,
      moodMultiplier: 1.2,
      tempoMultiplier: 1.5,
    })
  })
  it('returns unchanged multipliers if activity type is not "ride"', () => {
    const runActivity = { ...fakeActivity({ type: 'run' }), id: 2 }
    const multipliers = defaultMultipliers()

    const unupdated = cadenceUpdate(multipliers, runActivity)

    expect(unupdated).toEqual(multipliers)
  })
  it('returns unchanged multipliers when cadence is null', () => {
    const noCadence = fakeActivity({ type: 'ride', cadence: null })
    const runActivity = {
      ...(noCadence as ActivityFull),
      id: 2,
    }
    const multipliers = defaultMultipliers()

    const unupdated = cadenceUpdate(multipliers, runActivity)

    expect(unupdated).toEqual(multipliers)
  })
})

describe('caloriesUpdate', () => {
  it('updates multipliers based on calories', () => {
    //
  })
})
describe('speedUpdate', () => {
  it('updates multipliers based on speed', () => {
    //
  })
})

describe('distanceUpdate', () => {
  it('updates multipliers based on dinstance', () => {
    //
  })
})
describe('updateMultipliersActivity', () => {
  it('updates multipliers when all activity stats are provided', () => {
    //
  })
  it('updates multipliers when some activity stats are provided', () => {
    //
  })
  it('updates multipliers when none activity stats are provided', () => {
    //
  })
})
