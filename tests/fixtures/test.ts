import { test as base } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { OtpPage } from '../pages/auth/OtpPage';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';

type AppFixtures = {
  homePage: HomePage;
  otpPage: OtpPage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  otpPage: async ({ page }, use) => {
    await use(new OtpPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
});

export { expect } from '@playwright/test';
