import { test, expect } from '@playwright/test'
import { fakeUser } from './utils/fakes'
import { asUser, deleteUser, createActivityWithSongs } from './utils/api'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('playbackView', () => {
  test('navigates to playback view from dashboard', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await createActivityWithSongs()
      await createActivityWithSongs()
      await page.goto('/dashboard')
      await expect(page.getByText('Once you have completed your')).not.toBeVisible()
      await page.getByText('Test activity').first().click()
      await expect(page.getByText('Id:', { exact: true })).toBeVisible()
      await expect(page.getByText('Origin:', { exact: true })).toBeVisible()
      await expect(page.getByText('Song', { exact: true })).toBeVisible()
      await deleteUser({ email: user.email })
    })
  })
  test('can navigate to activity by url and change songs', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      const activity1 = await createActivityWithSongs()
      const activity2 = await createActivityWithSongs()
      await page.goto(`playback/${activity1.activityId}`)
      await expect(page.getByText('title')).toBeVisible()
      await expect(page.getByText(': Test activity')).toBeVisible()
      await page.goto(`playback/${activity2.activityId}`)
      await expect(page.getByText('title')).toBeVisible()
      await expect(page.getByText('Test activity')).toBeVisible()
      await expect(page.getByText('First song').first()).toBeVisible()
      await page.getByRole('button', { name: 'Go to slide 2' }).click()
      await expect(page.getByText('Second song').first()).toBeVisible()
      await page.getByRole('button', { name: 'Go to slide 1' }).click()
      await expect(page.getByText('First song').first()).toBeVisible()
      await deleteUser({ email: user.email })
    })
  })
  test.skip('audio player can play, pause, reset song time', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      const activity = await createActivityWithSongs()
      await page.goto(`playback/${activity.activityId}`)
    })
  })
})
