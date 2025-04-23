import { test, expect } from '@playwright/test'
import { fakeUser } from './utils/fakes'
import { asUser, createFakeTokens, deleteUser } from './utils/api'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('AuthenticatedView', () => {
  test('displays an error, when no code was provided by Strava', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await page.goto('/authenticated')
      const errorMessage = page.getByRole('heading', { name: 'Something went wrong getting' })
      await expect(errorMessage).toBeVisible()

      await deleteUser({ email: user.email })
    })
  })
  test('displays strava authorization message and button if user not authorized yet', async ({
    page,
  }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'To start using our app click' })
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Authorize Strava' })).toBeVisible()

      await deleteUser({ email: user.email })
    })
  })
  test('does not display authorize strava message and button when user is authorized', async ({
    page,
  }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      const authorizeButton = page.getByRole('button', { name: 'Authorize Strava' })
      const authrizeMessage = page.getByRole('heading', { name: 'To start using our app click' })
      await createFakeTokens()
      await page.goto('/')
      await expect(authorizeButton).not.toBeVisible()
      await expect(authrizeMessage).not.toBeVisible()

      await deleteUser({ email: user.email })
    })
  })
  test('redirects to strava authorization/login page once button clicked', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await page.goto('/')
      await page.getByRole('button', { name: 'Authorize Strava' }).click()
      await expect(page).toHaveURL('https://www.strava.com/login')

      await deleteUser({ email: user.email })
    })
  })
})
