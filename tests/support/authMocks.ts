import type { Page } from '@playwright/test';

import { authTestUser } from '../test-data/authUsers';
import { jsonResponse } from './api';

type RecaptchaMockWindow = Window &
  typeof globalThis & {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: { callback: (token: string) => void }
      ) => number;
      reset: () => undefined;
    };
  };

const authApiRoutes = {
  login: '**/uam/login',
  userInfo: '**/uam/info',
  verifyOtp: '**/uam/verify-otp',
};

export const mockRecaptcha = async (page: Page) => {
  await page.addInitScript(() => {
    (window as RecaptchaMockWindow).grecaptcha = {
      ready: (callback: () => void) => callback(),
      render: (
        _container: HTMLElement,
        parameters: { callback: (token: string) => void }
      ) => {
        window.setTimeout(() => parameters.callback('playwright-captcha-token'), 0);
        return 1;
      },
      reset: () => undefined,
    };
  });
};

export const mockSuccessfulSignInApis = async (page: Page) => {
  await page.route(authApiRoutes.login, async (route) => {
    await route.fulfill(
      jsonResponse({
        code: 200,
        header: { code: 200, message: 'OTP sent successfully' },
        response: {},
      })
    );
  });

  await page.route(authApiRoutes.verifyOtp, async (route) => {
    await route.fulfill(
      jsonResponse({
        code: 200,
        message: 'Login successful',
        response: {
          access_token: 'playwright-access-token',
          apitoken: 'playwright-api-token',
          firstname: authTestUser.firstName,
          lastname: authTestUser.lastName,
          loginType: 'user',
          usertype: 'user',
          grp: 1,
          enabled: 1,
          is_approved: 1,
        },
      })
    );
  });

  await page.route(authApiRoutes.userInfo, async (route) => {
    await route.fulfill(
      jsonResponse({
        code: 200,
        response: {
          email: authTestUser.email,
          firstname: authTestUser.firstName,
          lastname: authTestUser.lastName,
          loginType: 'user',
          usertype: 'user',
          grp: 1,
          enabled: 1,
          is_approved: 1,
        },
      })
    );
  });
};
