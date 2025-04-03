import {
  fakeActivity,
  fakeGenre,
  fakeTrait,
} from '@server/entities/tests/fakes'
import type { ActivityFull } from '@server/entities/activity'
import { generatePrompt } from '..'

const genres = [fakeGenre({ id: 1 })]
const traits = [
  {
    id: 1,
    ...fakeTrait({
      complexityMultiplier: 1,
      energyMultiplier: 1.25,
      moodMultiplier: 1.4,
      tempoMultiplier: 1,
      genreId: 1,
      genreBias: 1.2,
    }),
  },
  {
    id: 2,
    ...fakeTrait({
      complexityMultiplier: 1.1,
      energyMultiplier: 1.2,
      moodMultiplier: 0.8,
      tempoMultiplier: 1.1,
      genreId: 1,
      genreBias: 1.2,
    }),
  },
  {
    id: 3,
    ...fakeTrait({
      complexityMultiplier: 1.2,
      energyMultiplier: 1,
      moodMultiplier: 1.1,
      tempoMultiplier: 1.1,
      genreId: 1,
      genreBias: 1.2,
    }),
  },
]
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

it('generates prompt with title and song style', () => {
  const prompt = generatePrompt(activity, traits, genres)

  expect(prompt).toEqual({
    prompt: expect.any(String),
    style: genres[0].name,
    title: activity.title,
  })
})
it('generates prompt without title', () => {
  const activityNoTitle = {
    ...(fakeActivity({
      title: null,
      type: 'ride',
      cadence: 68,
      speedAverage: 12,
      distance: 12000,
      calories: 700,
      heartrate: 140,
    }) as unknown as ActivityFull),
    id: 1,
  }
  const prompt = generatePrompt(activityNoTitle, traits, genres)

  expect(prompt).toEqual({
    prompt: expect.any(String),
    style: genres[0].name,
    title: 'workout song',
  })
})
it('generates promt without style', () => {
  const genresNotInTraits = [fakeGenre({ id: 1, name: 'Rock' })]
  const traitsNoGenre = [{ id: 1, ...fakeTrait({ genreBias: 1, genreId: 2 }) }]
  const prompt = generatePrompt(activity, traitsNoGenre, genresNotInTraits)
  expect(prompt).toEqual({
    prompt: expect.any(String),
    style: 'pick random',
    title: activity.title,
  })
})
