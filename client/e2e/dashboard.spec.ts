import { test, expect } from '@playwright/test'
import { fakeUser } from './utils/fakes'
import { asUser, deleteUser, createActivityWithSongs } from './utils/api'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('DashboardView', () => {
  test('displays instruction message when no activities were found', async ({ page }) => {
    const user = fakeUser()

    await asUser(page, user, async () => {
      await page.goto('/dashboard')
      await expect(page.getByText('Once you have completed your')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Load activities' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Request songs' })).toBeVisible()
      await deleteUser({ email: user.email })
    })
  })
  test('displays activities from db', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await createActivityWithSongs()
      await createActivityWithSongs()
      await page.goto('/dashboard')
      await expect(page.getByText('Once you have compelted your')).not.toBeVisible()
      await expect(page.getByText('Test activity').first()).toBeVisible()
      await expect(page.getByText('Test activity').nth(1)).toBeVisible()
      await expect(page.getByRole('button', { name: 'Load activities' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Request songs' })).toBeVisible()
      await page.getByRole('button', { name: 'Request songs' }).click()
      await expect(page.getByText('No songs found', { exact: true })).toBeVisible()
      await page.getByRole('button', { name: 'Load activities' }).click()
      await expect(page.getByText('Activities loaded', { exact: true })).toBeVisible()
      await deleteUser({ email: user.email })
    })
  })
})
