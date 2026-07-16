import { test } from './fixtures/test';
import { mockRecaptcha, mockSuccessfulSignInApis } from './support/authMocks';
import { authTestUser } from './test-data/authUsers';

test.describe('Sign in', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('shows the sign-in screen', async ({ page, signInPage }) => {
    await mockRecaptcha(page);
    await signInPage.goto();

    await signInPage.expectLoaded();
  });

  test('signs in with OTP and lands on the home page', async ({
    homePage,
    otpPage,
    page,
    signInPage,
  }) => {
    await mockSuccessfulSignInApis(page);
    await mockRecaptcha(page);
    await signInPage.goto();
    await signInPage.expectLoaded();

    await signInPage.requestOtp(authTestUser.email);
    await otpPage.expectLoaded(authTestUser.email);
    await otpPage.submitOtp(authTestUser.otp);

    await homePage.expectLoaded(authTestUser.firstName);
  });
});
