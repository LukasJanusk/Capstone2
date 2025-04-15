import { it } from 'vitest'
import { parseStravaActivity, transformActivityFromStrava } from '../schema'
import { stravaActivityResponse } from './utils/fakes'

it('parses activity data', async () => {
  const data = {
    id: 123,
    athlete: { id: 1, first_name: 'Michael', last_name: 'Jackson' },
    start_date: '2018-02-16T14:52:54Z',
    start_date_local: '2018-02-16T14:52:54Z',
    calories: 555,
    average_speed: 25.5,
    max_speed: 35,
  }
  const parsed = parseStravaActivity(data)

  expect(parsed).toMatchObject({
    id: 123,
    athlete: { id: 1 },
    start_date: '2018-02-16T14:52:54Z',
    start_date_local: '2018-02-16T14:52:54Z',
    calories: 555,
    average_speed: 25.5,
    max_speed: 35,
  })
})
it('parses fake response data', async () => {
  const response = stravaActivityResponse()
  const parsed = parseStravaActivity(response)

  expect(parsed.id).toEqual(response.id)
  expect(parsed.athlete).toEqual({ id: response.athlete.id })
})
it('throws an error when id field is missing', async () => {
  const data = {
    athlete: { id: 1, first_name: 'Michael', last_name: 'Jackson' },
    start_date: '2018-02-16T14:52:54Z',
    start_date_local: '2018-02-16T14:52:54Z',
    calories: 555,
    average_speed: 25.5,
    max_speed: 35,
  }
  expect(() => parseStravaActivity(data)).toThrow(/id/i)
})
it('transforms activity from strava activity response to application default format', async () => {
  const data = {
    id: 123,
    athlete: { id: 1, first_name: 'Michael', last_name: 'Jackson' },
    start_date: '2018-02-16T14:52:54Z',
    start_date_local: '2018-02-16T14:52:54Z',
    calories: 555,
    average_speed: 25.5,
    max_speed: 35,
  }

  const transformed = transformActivityFromStrava(data)

  expect(transformed).toEqual({
    originId: 123,
    origin: 'strava',
    startTime: '2018-02-16T14:52:54Z',
    calories: 555,
    type: 'static',
    speedAverage: 25.5,
    cadence: null,
    distance: null,
    duration: null,
    title: null,
    heartrate: null,
  })
})
