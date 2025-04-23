import { test, expect } from '@playwright/test'
import { fakeUser } from './utils/fakes'
import { asUser, deleteUser } from './utils/api'

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
    expect(page.getByRole('button', { name: 'Sign Up', exact: true })).toBeVisible()
  })
  test('submits signupfrom when all fields are filled', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')

    await page.getByText('First name*').click()
    await page.getByRole('textbox', { name: 'First name*' }).fill(user.firstName)
    await page.getByText('Last name*').click()
    await page.getByRole('textbox', { name: 'Last name*' }).fill(user.lastName)
    await page.getByText('Email*').click()
    await page.getByRole('textbox', { name: 'Email*' }).fill(user.email)
    await page.getByText('Password*').click()
    await page.getByRole('textbox', { name: 'Password*' }).fill(user.password)
    await page.getByRole('listbox').click()
    await page.getByRole('listbox').click()
    await page.getByRole('listbox').click()
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in now' })).toBeVisible()
    await asUser(page, user, async () => {
      await deleteUser({ email: user.email })
    })
  })
  test('does not allow signin when there are less than 3 traits selected', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')
    await page.getByText('First name*').click()
    await page.getByRole('textbox', { name: 'First name*' }).fill(user.firstName)
    await page.getByText('Last name*').click()
    await page.getByRole('textbox', { name: 'Last name*' }).fill(user.lastName)
    await page.getByText('Email*').click()
    await page.getByRole('textbox', { name: 'Email*' }).fill(user.email)
    await page.getByText('Password*').click()
    await page.getByRole('textbox', { name: 'Password*' }).fill(user.password)
    await page.getByRole('listbox').click()
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'Must select at least 3 traits' })).toBeVisible()
  })
  test('user can logout', async ({ page }) => {
    const user = fakeUser()

    await asUser(page, user, async () => {
      await page.goto('/home')

      const logoutButton = page.getByRole('button', { name: 'Sign out' })
      await logoutButton.click()
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
    const errorMessage = page.getByRole('heading', { name: 'Unauthorized, please login' })
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
  test('toggles header', async ({ page }) => {
    const signUpButton = page.getByRole('button', { name: 'Sign up' })
    const signInButton = page.getByRole('button', { name: 'Sign in' })
    await expect(signInButton).toBeVisible()
    await expect(signUpButton).toBeVisible()
    await page.getByRole('img', { name: 'collapse-button' }).click()
    await expect(signInButton).not.toBeVisible()
    await expect(signUpButton).not.toBeVisible()
    await page.getByRole('img', { name: 'expand-button' }).click()
    await expect(signInButton).toBeVisible()
    await expect(signUpButton).toBeVisible()
  })
})
