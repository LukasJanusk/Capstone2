import supertest from 'supertest'
import { describe, it, expect } from 'vitest'
import type { Kysely } from 'kysely'
import config from '@server/config'
import createApp from '../app'

const db = [] as unknown as Kysely<any>
const app = createApp(db)
describe('Express App', () => {
  it('GET /api/health should return OK', async () => {
    const res = await supertest(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.text).toBe('OK')
  })
})
describe('Strava webhook subscribtion', () => {
  it('GET /api/trpc/strava.webhooks success', async () => {
    const query = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'challenge_string',
      'hub.verify_token': config.stravaSubscribtionKey,
    }
    const res = await supertest(app)
      .get('/api/trpc/strava.webhooks')
      .query(query)
    expect(res.body).toEqual({ 'hub.challenge': 'challenge_string' })
  })
  it('GET /api/trpc/strava.webhooks missing input', async () => {
    const query = {
      'hub.mode': 'subscribe',
      'hub.verify_token': config.stravaSubscribtionKey,
    }
    const res = await supertest(app)
      .get('/api/trpc/strava.webhooks')
      .query(query)
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request' })
  })
  it('GET /api/trpc/strava.webhooks hub.challenge missing', async () => {
    const query = {
      'hub.mode': 'subscribe',
      'hub.verify_token': config.stravaSubscribtionKey,
      'hub.challenge': '',
    }
    const res = await supertest(app)
      .get('/api/trpc/strava.webhooks')
      .query(query)
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Missing hub_challenge parameter' })
  })
})
