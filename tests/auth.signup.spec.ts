import { test } from './fixtures/test';
import { mockRecaptcha, mockSuccessfulSignUpApis } from './support/authMocks';
import { signupTestUser } from './test-data/authUsers';

test.describe('Sign up', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('shows the sign-up screen', async ({ page, signUpPage }) => {
    await mockRecaptcha(page);
    await signUpPage.goto();

    await signUpPage.expectLoaded();
  });

  test('submits signup request and shows approval pending state', async ({
    page,
    signUpPage,
  }) => {
    await mockSuccessfulSignUpApis(page);
    await mockRecaptcha(page);
    await signUpPage.goto();
    await signUpPage.expectLoaded();

    await signUpPage.submit(signupTestUser);

    await signUpPage.expectApprovalPending(signupTestUser.email);
  });
});
