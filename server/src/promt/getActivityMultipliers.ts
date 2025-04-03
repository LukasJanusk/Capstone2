import type { ActivityFull } from '@server/entities/activity'
import type { Multipliers } from '.'

export function cadenceUpdate(
  multipliers: Multipliers,
  activity: ActivityFull
): Multipliers {
  // Low Cadence: 50-70 RPM, Average Cadence: 70-90 RPM, High Cadence: 90-110+ RPM
  const low = 70
  const average = 90
  const updated = multipliers
  if (!activity.cadence || activity.type !== 'ride') {
    return multipliers
  }
  if (activity.cadence <= low) {
    // update low multipliers
    updated.energyMultiplier *= 0.8
    updated.tempoMultiplier *= 0.7
    updated.moodMultiplier *= 0.9
  } else if (activity.cadence <= average) {
    // update average multipliers
    updated.energyMultiplier *= 1.1
    updated.moodMultiplier *= 1.1
  } else {
    // update high multipliers
    updated.energyMultiplier *= 1.2
    updated.tempoMultiplier *= 1.5
    updated.moodMultiplier *= 1.2
  }

  return updated
}

export function heartRateUpdate(
  multipliers: Multipliers,
  activity: ActivityFull
) {
  // Low HR: 95-133 bpm, Mid HR: 133-162 bpm, High HR: 162-190 bpm
  const low = 125
  const average = 160
  const updated = multipliers
  if (!activity.heartrate) {
    return multipliers
  }
  if (activity.heartrate <= low) {
    // update low multipliers
    updated.energyMultiplier *= 0.8
    updated.tempoMultiplier *= 0.8
    updated.moodMultiplier *= 0.9
  } else if (activity.heartrate <= average) {
    // update average multipliers
    updated.energyMultiplier *= 1.1
  } else {
    // update high multipliers
    updated.energyMultiplier *= 1.2
    updated.tempoMultiplier *= 1.4
    updated.moodMultiplier *= 1.2
  }

  return updated
}
export function caloriesUpdate(
  multipliers: Multipliers,
  activity: ActivityFull
) {
  const low = 250
  const average = 500
  const updated = multipliers
  if (!activity.calories) {
    return multipliers
  }
  if (activity.calories <= low) {
    // update low multipliers
    updated.energyMultiplier *= 0.8
    updated.complexityMultiplier *= 0.9
  } else if (activity.calories <= average) {
    // update average multipliers
    updated.energyMultiplier *= 1.1
    updated.complexityMultiplier *= 1.1
  } else {
    // update high multipliers
    updated.energyMultiplier *= 1.2
    updated.complexityMultiplier *= 1.2
  }

  return updated
}
export function speedUpdate(multipliers: Multipliers, activity: ActivityFull) {
  if (!activity.speedAverage) {
    return multipliers
  }
  const updated = { ...multipliers }
  if (activity.type === 'ride') {
    const low = 6
    const average = 9
    if (activity.speedAverage <= low) {
      updated.complexityMultiplier *= 0.9
      updated.energyMultiplier *= 0.8
      updated.moodMultiplier *= 0.8
      updated.tempoMultiplier *= 0.8
    } else if (activity.speedAverage <= average) {
      updated.complexityMultiplier *= 1
      updated.energyMultiplier *= 1.1
      updated.moodMultiplier *= 1
      updated.tempoMultiplier *= 1.1
    } else {
      updated.complexityMultiplier *= 1.1
      updated.energyMultiplier *= 1.2
      updated.moodMultiplier *= 1.2
      updated.tempoMultiplier *= 1.4
    }
    return updated
  }
  if (activity.type === 'run') {
    const low = 2
    const average = 5
    if (activity.speedAverage <= low) {
      updated.complexityMultiplier *= 0.9
      updated.energyMultiplier *= 0.8
      updated.moodMultiplier *= 0.8
      updated.tempoMultiplier *= 0.8
    } else if (activity.speedAverage <= average) {
      updated.complexityMultiplier *= 1
      updated.energyMultiplier *= 1.1
      updated.moodMultiplier *= 1
      updated.tempoMultiplier *= 1.1
    } else {
      updated.complexityMultiplier *= 1.1
      updated.energyMultiplier *= 1.2
      updated.moodMultiplier *= 1.2
      updated.tempoMultiplier *= 1.5
    }
  }
  if (activity.type === 'static') {
    return multipliers
  }
  return updated
}
export function distanceUpdate(
  multipliers: Multipliers,
  activity: ActivityFull
) {
  if (!activity.distance || activity.type === 'static') {
    return multipliers
  }
  const updated = multipliers
  if (activity.type === 'ride') {
    const low = 15000
    const average = 25000
    if (activity.distance <= low) {
      updated.complexityMultiplier *= 0.9
    } else if (activity.distance <= average) {
      updated.complexityMultiplier *= 1.1
    } else {
      updated.complexityMultiplier *= 1.2
    }
  } else if (activity.type === 'run') {
    const low = 5000
    const average = 8000
    if (activity.distance <= low) {
      updated.complexityMultiplier *= 0.9
    } else if (activity.distance <= average) {
      updated.complexityMultiplier *= 1.1
    } else {
      updated.complexityMultiplier *= 1.2
    }
  }
  return updated
}

export function updateMultipliersActivity(
  multipliers: Multipliers,
  activity: ActivityFull
) {
  let updated = multipliers
  updated = cadenceUpdate(updated, activity)
  updated = heartRateUpdate(updated, activity)
  updated = caloriesUpdate(updated, activity)
  updated = speedUpdate(updated, activity)
  updated = distanceUpdate(updated, activity)

  return {
    complexityMultiplier: parseFloat(updated.complexityMultiplier.toFixed(2)),
    energyMultiplier: parseFloat(updated.energyMultiplier.toFixed(2)),
    moodMultiplier: parseFloat(updated.moodMultiplier.toFixed(2)),
    tempoMultiplier: parseFloat(updated.tempoMultiplier.toFixed(2)),
  }
}
