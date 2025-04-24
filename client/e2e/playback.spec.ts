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
      await expect(page.getByRole('heading', { name: 'Test activity' }).first()).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Test activity' }).nth(1)).toBeVisible()
      await expect(page.getByRole('button', { name: 'Load activities' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Request songs' })).toBeVisible()
      await page
        .locator('div')
        .filter({ hasText: /Test activity/ })
        .first()
        .click()

      await expect(page.getByRole('heading', { name: 'Activity' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Songs' })).toBeVisible()
      await expect(page.getByText('title')).toBeVisible()
      await expect(page.getByText(': Test activity')).toBeVisible()
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
      await expect(page.getByText(': Test activity')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'First song' })).toBeVisible()
      await page.getByRole('img', { name: 'right-arrow' }).click()
      await expect(page.getByRole('heading', { name: 'Second song' })).toBeVisible()
      await page.getByRole('img', { name: 'right-arrow' }).click()
      await expect(page.getByRole('heading', { name: 'First song' })).toBeVisible()
      await deleteUser({ email: user.email })
    })
  })
  test('audio player can play, pause, reset song time', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      const audioPlayer = page.locator('audio')
      const activity = await createActivityWithSongs()
      await page.goto(`playback/${activity.activityId}`)
      await expect(audioPlayer).toBeVisible()
      const currentTime = await audioPlayer.evaluate((audio: HTMLAudioElement) => audio.currentTime)
      await audioPlayer.evaluate((audio: HTMLAudioElement) => {
        audio.play()
      })
      await page.waitForTimeout(200)
      expect(currentTime).toBe(0)

      await audioPlayer.evaluate((audio: HTMLAudioElement) => {
        audio.pause()
      })
      const currentTimeAfterPause = await audioPlayer.evaluate(
        (audio: HTMLAudioElement) => audio.currentTime
      )
      await page.waitForTimeout(200)
      const afterDelay = await audioPlayer.evaluate((audio: HTMLAudioElement) => audio.currentTime)
      expect(currentTimeAfterPause).toBe(afterDelay)
      await page.getByRole('img', { name: 'right-arrow' }).click()
      const newSongCurrentTime = await audioPlayer.evaluate(
        (audio: HTMLAudioElement) => audio.currentTime
      )
      expect(newSongCurrentTime).toBe(0)
      await deleteUser({ email: user.email })
    })
  })
})
