import { expect, type Page } from '@playwright/test';

export class SignInPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async expectLoaded() {
    await expect(this.page.getByTestId('auth-brand-logo')).toBeVisible();
    await expect(this.page.getByTestId('auth-brand-name')).toHaveText('Enspeek');
    await expect(this.page.getByTestId('auth-card-title')).toHaveText('Sign in to continue');
    await expect(this.page.getByTestId('signin-email-input')).toBeVisible();
    await expect(this.page.getByTestId('signin-submit-button')).toBeVisible();
  }

  async requestOtp(email: string) {
    await this.page.getByTestId('signin-email-input').fill(email);
    await expect(this.page.getByTestId('signin-submit-button')).toBeEnabled();
    await this.page.getByTestId('signin-submit-button').click();
  }
}
