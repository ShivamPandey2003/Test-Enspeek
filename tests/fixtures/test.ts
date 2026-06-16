import { test as base } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { OtpPage } from '../pages/auth/OtpPage';
import { SignInPage } from '../pages/auth/SignInPage';

type AppFixtures = {
  homePage: HomePage;
  otpPage: OtpPage;
  signInPage: SignInPage;
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
});

export { expect } from '@playwright/test';
