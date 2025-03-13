import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('HomeView', () => {
  test('navigates to singup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign up' }).click()

    expect(page.getByText('First name*')).toBeVisible()
    expect(page.getByText('Last name*')).toBeVisible()
    expect(page.getByText('Password*')).toBeVisible()
    expect(page.getByText('Traits*')).toBeVisible()
    expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })
})
