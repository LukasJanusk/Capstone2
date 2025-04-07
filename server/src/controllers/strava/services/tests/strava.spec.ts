import { it, describe, vi } from 'vitest'
import { createStravaService } from '..'
import {
  mockStravaResponse,
  fakeStravaAccessTokens,
  mockStravaAthleteResponse,
  mockActivityResponse,
} from './utils/fakes'

beforeEach(() => {
  vi.restoreAllMocks()
})

const CLIENT_SECRET_TEST = 'testsecret'
const CLIENT_ID_TEST = 'test_id'
vi.stubGlobal('fetch', () => mockStravaResponse())
const stravaService = createStravaService(CLIENT_ID_TEST, CLIENT_SECRET_TEST)

describe('getUserTokens', () => {
  it('returns tokens with athlete data', async () => {
    const fakeResponseData = fakeStravaAccessTokens()
    vi.stubGlobal(
      'fetch',
      vi.fn(() => mockStravaResponse(fakeResponseData))
    )
    const tokensData = await stravaService.getUserTokens('codeString')

    expect(tokensData).toEqual(fakeResponseData)
    expect(tokensData.token_type).toEqual('Bearer')
  })
  it('throws Error when failes to fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => {
        throw new Error('timeout')
      })
    )
    await expect(stravaService.getUserTokens('codeString')).rejects.toThrow(
      /timeout/i
    )
  })
  it('throws Error schema missmatch', async () => {
    const fakeData = fakeStravaAccessTokens() as any
    fakeData.token_type = 'Basic'
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Response(JSON.stringify(fakeStravaAccessTokens(fakeData)), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      )
    )
    await expect(stravaService.getUserTokens('codeString')).rejects.toThrow(
      /bearer/i
    )
  })
})

describe('refreshUserAccessToken', () => {
  it('returns refreshed access token', async () => {
    const fakeData = fakeStravaAccessTokens() as any
    fakeData.token_type = 'Bearer'
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Response(JSON.stringify(fakeStravaAccessTokens(fakeData)), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      )
    )

    const result = await stravaService.refreshUserAccessToken('valid_token')

    expect(result).toEqual({
      token_type: 'Bearer',
      access_token: fakeData.access_token,
      expires_at: fakeData.expires_at,
      expires_in: fakeData.expires_in,
      refresh_token: fakeData.refresh_token,
    })
  })
  it('it throws an error when fails to fetch tokens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Response(JSON.stringify({ code: 400, msg: 'bad request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
      )
    )
    await expect(
      stravaService.refreshUserAccessToken('valid_token')
    ).rejects.toThrow(/Error accessing Strava servers/i)
  })
})
describe('getUser', async () => {
  it('returns strava user data', async () => {
    const userData = {
      id: 2,
      firstname: 'Michael',
      lastname: 'Jackson',
    }
    vi.stubGlobal(
      'fetch',
      vi.fn(() => mockStravaAthleteResponse(userData))
    )
    const response = await stravaService.getUser('userAccessToken')
    expect(response).toEqual({
      id: 2,
      firstname: 'Michael',
      lastname: 'Jackson',
    })
  })
  it('throws an error when fails to fetch data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => {
        throw new Error('Rejected')
      })
    )
    await expect(stravaService.getUser('userToken')).rejects.toThrow(
      /error accessing Strava servers/i
    )
  })
  it('throws an error when fails to parse data', async () => {
    const userData = {}
    vi.stubGlobal(
      'fetch',
      vi.fn(() => mockStravaAthleteResponse(userData))
    )
  })
  await expect(stravaService.getUser('userToken')).rejects.toThrow(
    /error accessing Strava servers/i
  )
  it('throws when ')
})
describe('getActivityById', async () => {
  it('returns activity data', async () => {
    const athlete = { id: 222, first_name: 'Mark' }
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        mockActivityResponse({
          id: 123,
          athlete,
          start_date: '2018-02-16T14:52:54Z',
          start_date_local: '2018-02-16T14:52:54Z',
        })
      )
    )
    const response = await stravaService.getActivityById(123, 'userToken')
    expect(response!.athlete.id).toEqual(athlete.id)
  })
  it('throws an error when activity wrong format', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        mockActivityResponse({
          id: 123,
          athlete: { user: 1 },
          start_date: '2018-02-16T14:52:54Z',
          start_date_local: '2018-02-16T14:52:54Z',
        })
      )
    )
    expect(await stravaService.getActivityById(1, 'userToken')).toBeNull()
  })
})
