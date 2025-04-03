import { fakeActivity } from '@server/entities/tests/fakes'
import type { ActivityFull } from '@server/entities/activity'
import { speedUpdate } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

describe('speedUpdate for activity type: "ride"', () => {
  it('updates multipliers based on speed, when it is low', () => {
    const multipliers = defaultMultipliers()
    const rideActivityLowSpeed = {
      ...(fakeActivity({ type: 'ride', speedAverage: 5 }) as ActivityFull),
      id: 3,
    }

    const updated = speedUpdate(multipliers, rideActivityLowSpeed)

    expect(updated).toEqual({
      complexityMultiplier: 0.9,
      energyMultiplier: 0.8,
      moodMultiplier: 0.8,
      tempoMultiplier: 0.8,
    })
  })
  it('updates multipliers based on speed, when it is average', () => {
    const multipliers = defaultMultipliers()
    const rideActivityAvgSpeed = {
      ...(fakeActivity({ type: 'ride', speedAverage: 7 }) as ActivityFull),
      id: 3,
    }

    const updated = speedUpdate(multipliers, rideActivityAvgSpeed)

    expect(updated).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.1,
      moodMultiplier: 1,
      tempoMultiplier: 1.1,
    })
  })
  it('updates multipliers based on speed, when it is high', () => {
    const multipliers = defaultMultipliers()
    const rideActivityHighSpeed = {
      ...(fakeActivity({ type: 'ride', speedAverage: 12 }) as ActivityFull),
      id: 3,
    }

    const updated = speedUpdate(multipliers, rideActivityHighSpeed)

    expect(updated).toEqual({
      complexityMultiplier: 1.1,
      energyMultiplier: 1.2,
      moodMultiplier: 1.2,
      tempoMultiplier: 1.4,
    })
  })
  it('returns unchanged multipliers when speed is null', () => {
    const multipliers = defaultMultipliers()
    const rideActivityNoSpeed = {
      ...(fakeActivity({ type: 'ride', speedAverage: null }) as ActivityFull),
      id: 3,
    }
    const unupdated = speedUpdate(multipliers, rideActivityNoSpeed)
    expect(unupdated).toEqual(multipliers)
  })
})

describe('speedUpdate for activity type: "run"', () => {
  it('updates multipliers based on speed, when it is low', () => {
    const multipliers = defaultMultipliers()
    const runActivityLow = {
      ...(fakeActivity({ type: 'run', speedAverage: 2 }) as ActivityFull),
      id: 3,
    }

    const updated = speedUpdate(multipliers, runActivityLow)

    expect(updated).toEqual({
      complexityMultiplier: 0.9,
      energyMultiplier: 0.8,
      moodMultiplier: 0.8,
      tempoMultiplier: 0.8,
    })
  })

  it('updates multipliers based on speed, when it is average', () => {
    const multipliers = defaultMultipliers()
    const runActivityAverage = {
      ...(fakeActivity({ type: 'run', speedAverage: 3 }) as ActivityFull),
      id: 3,
    }
    const updated = speedUpdate(multipliers, runActivityAverage)

    expect(updated).toEqual({
      complexityMultiplier: 1,
      energyMultiplier: 1.1,
      moodMultiplier: 1,
      tempoMultiplier: 1.1,
    })
  })
  it('updates multipliers based on speed, when it is high', () => {
    const multipliers = defaultMultipliers()
    const runActivityHigh = {
      ...(fakeActivity({ type: 'run', speedAverage: 7 }) as ActivityFull),
      id: 3,
    }
    const updated = speedUpdate(multipliers, runActivityHigh)

    expect(updated).toEqual({
      complexityMultiplier: 1.1,
      energyMultiplier: 1.2,
      moodMultiplier: 1.2,
      tempoMultiplier: 1.5,
    })
  })
  it('returns unchanged multipliers when speed is null', () => {
    const multipliers = defaultMultipliers()
    const runActivityNoSpeed = {
      ...(fakeActivity({ type: 'run', speedAverage: null }) as ActivityFull),
      id: 3,
    }
    const unupdated = speedUpdate(multipliers, runActivityNoSpeed)

    expect(unupdated).toEqual(multipliers)
  })
})
describe('speedUpdate for activity type: "static"', () => {
  it('returns unchanged multipliers when activity type is static', () => {
    const multipliers = defaultMultipliers()
    const runActivityStatic = {
      ...(fakeActivity({ type: 'static', speedAverage: 1 }) as ActivityFull),
      id: 3,
    }
    const unupdated = speedUpdate(multipliers, runActivityStatic)

    expect(unupdated).toEqual(multipliers)
  })
})
