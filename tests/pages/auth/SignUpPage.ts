import { expect, type Page } from '@playwright/test';

import type { signupTestUser } from '../../test-data/authUsers';

type SignupUser = typeof signupTestUser;

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await this.page.getByTestId('auth-switch-to-signup').click();
  }

  async expectLoaded() {
    await expect(this.page.getByTestId('auth-brand-logo')).toBeVisible();
    await expect(this.page.getByTestId('auth-brand-name')).toHaveText('Enspeek');
    await expect(this.page.getByTestId('auth-card-title')).toHaveText('Create your account');
    await expect(this.page.getByTestId('signup-firstname-input')).toBeVisible();
    await expect(this.page.getByTestId('signup-lastname-input')).toBeVisible();
    await expect(this.page.getByTestId('signup-email-input')).toBeVisible();
    await expect(this.page.getByTestId('signup-submit-button')).toBeVisible();
  }

  async submit(user: SignupUser) {
    await this.page.getByTestId('signup-firstname-input').fill(user.firstName);
    await this.page.getByTestId('signup-lastname-input').fill(user.lastName);
    await this.page.getByTestId('signup-email-input').fill(user.email);
    await expect(this.page.getByTestId('signup-submit-button')).toBeEnabled();
    await this.page.getByTestId('signup-submit-button').click();
  }

  async expectApprovalPending(email: string) {
    await expect(this.page.getByTestId('auth-card-title')).toHaveText('Account Request Submitted');
    await expect(this.page.getByTestId('signup-approval-pending')).toBeVisible();
    await expect(this.page.getByText('Your account request is under review.')).toBeVisible();
    await expect(this.page.getByText(email)).toBeVisible();
  }
}
