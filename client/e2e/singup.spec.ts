import { test, expect } from '@playwright/test'
import { fakeUser } from './utils/fakes'
import { asUser, deleteUser } from './utils/api'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Sign up', () => {
  test('Signup page and pop up', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByText('First name')).toBeVisible()
    await expect(page.getByText('Last name')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
    await expect(page.getByText('Traits')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByText('First name')).toBeVisible()
    await expect(page.getByText('Last name')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
    await expect(page.getByText('Traits')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
  })
  test('submits signupfrom when all fields are filled', async ({ page }) => {
    const user = fakeUser()

    await page.goto('/signup')
    await page.getByText('First name').click()
    await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName)
    await page.getByText('Last name').click()
    await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName)
    await page.getByText('Email').click()
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
    await page.getByText('Password').click()
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password)
    await page.getByRole('button', { name: 'Show popup' }).click()
    await page.getByRole('option', { name: 'Optimistic' }).click()
    await page.getByRole('option', { name: 'Calm' }).click()
    await page.getByRole('option', { name: 'Melancholic' }).click()
    await page.getByRole('button', { name: 'Show popup' }).click()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' }).nth(1)).toBeVisible()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^About$/ })
        .getByRole('button')
    ).toBeVisible()

    await asUser(page, user, async () => {
      await deleteUser({ email: user.email })
    })
  })
  test('submits pop up signup from when all fields are filled', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/')

    await page.getByRole('button', { name: 'Sign up' }).click()
    await page.getByText('First name').click()
    await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName)
    await page.getByText('Last name').click()
    await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName)
    await page.getByText('Email').click()
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
    await page.getByText('Password').click()
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password)
    await page.getByRole('button', { name: 'Show popup' }).click()
    await page.getByRole('option', { name: 'Optimistic' }).click()
    await page.getByRole('option', { name: 'Calm' }).click()
    await page.getByRole('option', { name: 'Melancholic' }).click()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' }).nth(1)).toBeVisible()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^About$/ })
        .getByRole('button')
    ).toBeVisible()
    await asUser(page, user, async () => {
      await deleteUser({ email: user.email })
    })
  })
  test('Displays error to the user with form requirements when not met', async ({ page }) => {
    await page.goto('/signup')

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('#v-6-error')).toBeVisible()
    await expect(page.locator('#v-7-error')).toBeVisible()
    await expect(page.getByText('Invalid email')).toBeVisible()
    await expect(page.getByText('Must be at least 8')).toBeVisible()
    await expect(page.getByText('Must provide at least 3 traits')).toBeVisible()
  })
  test('user can logout', async ({ page }) => {
    const user = fakeUser()

    await asUser(page, user, async () => {
      await page.goto('/home')
      const logoutButton = page.getByRole('button', { name: 'Sign out' })
      await logoutButton.click()
      await page.getByRole('button', { name: 'Sign out', exact: true }).click()
      await expect(logoutButton).toBeHidden()
      await expect(page).toHaveURL('/signin')
      await expect(logoutButton).toBeHidden()
      await expect(page).toHaveURL('/signin')
      await deleteUser({ email: user.email })
    })
  })
  test('as user is redirected to "/" when non existant path is typed in', async ({ page }) => {
    const user = fakeUser()
    await asUser(page, user, async () => {
      await page.goto('/')
      await page.goto('/nonExistantPath')
      expect(await expect(page).toHaveURL('/'))
    })
  })
  test('as guest is redirected to "/signin" when non existant path is typed in', async ({
    page,
  }) => {
    await page.goto('/nonExistantPath')
    expect(await expect(page).toHaveURL('/signin'))
  })
  test('throws error when not logged in and trying to access protected route', async ({ page }) => {
    await page.goto('/dashboard')

    const errorMessage = page.getByText('Unauthorized, please login', { exact: true })
    await expect(page).toHaveURL('/signin')
    await expect(errorMessage).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(errorMessage).not.toBeVisible()
    await page.goto('/playback/1')
    await expect(page).toHaveURL('/signin')
    await expect(errorMessage).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(errorMessage).not.toBeVisible()
    await page.goto('/authenticated')
    await expect(page).toHaveURL('/signin')
    await expect(errorMessage).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(errorMessage).not.toBeVisible()
  })
})
