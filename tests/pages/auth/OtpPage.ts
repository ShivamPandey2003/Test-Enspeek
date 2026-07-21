import { expect, type Page } from '@playwright/test';

export class OtpPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(email: string) {
    await expect(this.page.getByRole('heading', { name: 'Verify your email' })).toBeVisible();
    await expect(this.page.getByText(`We sent a verification code to ${email}`)).toBeVisible();
  }

  async submitOtp(otp: string) {
    for (const [index, digit] of otp.split('').entries()) {
      await this.page.getByTestId(`otp-digit-${index}`).fill(digit);
    }

    await this.page.getByTestId('otp-submit-button').click();
  }
}
