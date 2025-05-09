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
      const errorMessage = page.getByText('Something went wrong getting Strava authorization', {
        exact: true,
      })
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
      await expect(page.getByText('To start using our app click')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Authorize Strava' })).toBeVisible()

      await deleteUser({ email: user.email })
    })
  })
  test('does not display redirect to dashboard button when user is authorized by strava', async ({
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
      await expect(page.getByText('To view your workouts click')).toBeVisible()
      await expect(page.getByRole('button', { name: 'To Dashboard' })).toBeVisible()

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
