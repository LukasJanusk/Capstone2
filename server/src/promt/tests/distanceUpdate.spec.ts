import { fakeActivity } from '@server/entities/tests/fakes'
import type { ActivityFull } from '@server/entities/activity'
import { distanceUpdate } from '../getActivityMultipliers'
import { defaultMultipliers } from './utils'

//   return updated
describe('distanceUpdate for activity type: "ride"', () => {
  it('updates multipliers based on distance, when it is low', () => {
    const multipliers = defaultMultipliers()
    const rideActivityLowDistance = {
      ...(fakeActivity({ type: 'ride', distance: 5000 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, rideActivityLowDistance)

    expect(updated).toEqual({
      complexityMultiplier: 0.9,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on distance, when it is Average', () => {
    const multipliers = defaultMultipliers()
    const rideActivityAvgDistance = {
      ...(fakeActivity({ type: 'ride', distance: 16000 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, rideActivityAvgDistance)

    expect(updated).toEqual({
      complexityMultiplier: 1.1,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on distance, when it is High', () => {
    const multipliers = defaultMultipliers()
    const rideActivityHighDistance = {
      ...(fakeActivity({ type: 'ride', distance: 26000 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, rideActivityHighDistance)

    expect(updated).toEqual({
      complexityMultiplier: 1.2,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('returns unchanged multipliers when distance is null', () => {
    const multipliers = defaultMultipliers()
    const rideActivityNoDistance = {
      ...(fakeActivity({ type: 'ride', distance: null }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, rideActivityNoDistance)

    expect(updated).toEqual(multipliers)
  })
})
describe('distanceUpdate for activity type: "ride"', () => {
  it('updates multipliers based on distance, when it is low', () => {
    const multipliers = defaultMultipliers()
    const runActivityLowDistance = {
      ...(fakeActivity({ type: 'run', distance: 1600 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, runActivityLowDistance)
    expect(updated).toEqual({
      complexityMultiplier: 0.9,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on distance, when it is Average', () => {
    const multipliers = defaultMultipliers()
    const runActivityAvgDistance = {
      ...(fakeActivity({ type: 'run', distance: 6000 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, runActivityAvgDistance)

    expect(updated).toEqual({
      complexityMultiplier: 1.1,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('updates multipliers based on distance, when it is High', () => {
    const multipliers = defaultMultipliers()
    const runctivityHighDistance = {
      ...(fakeActivity({ type: 'run', distance: 16000 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, runctivityHighDistance)
    expect(updated).toEqual({
      complexityMultiplier: 1.2,
      energyMultiplier: 1,
      moodMultiplier: 1,
      tempoMultiplier: 1,
    })
  })
  it('returns unchanged multipliers when distance is null', () => {
    const multipliers = defaultMultipliers()
    const runActivityNoDistance = {
      ...(fakeActivity({ type: 'run', distance: null }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, runActivityNoDistance)

    expect(updated).toEqual(multipliers)
  })
})
describe('distanceUpdate for activity type: "static"', () => {
  it('updates multipliers based on distance, when it is High', () => {
    const multipliers = defaultMultipliers()
    const rideActivityStatic = {
      ...(fakeActivity({ type: 'static', distance: 1 }) as ActivityFull),
      id: 3,
    }
    const updated = distanceUpdate(multipliers, rideActivityStatic)

    expect(updated).toEqual(multipliers)
  })
})
// if (!activity.distance || activity.type === 'static') {
//     return multipliers
//   }
//   const updated = multipliers
//   if (activity.type === 'ride') {
//     const low = 15
//     const average = 25
//     if (activity.distance <= low) {
//       updated.complexityMultiplier *= 0.9
//     } else if (activity.distance <= average) {
//       updated.complexityMultiplier *= 1.1
//     } else {
//       updated.complexityMultiplier *= 1.2
//     }
//   } else if (activity.type === 'run') {
//     const low = 5
//     const average = 8
//     if (activity.distance <= low) {
//       updated.complexityMultiplier *= 0.9
//     } else if (activity.distance <= average) {
//       updated.complexityMultiplier *= 1.1
//     } else {
//       updated.complexityMultiplier *= 1.2
//     }
//   }
