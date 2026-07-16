import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async expectLoaded(firstName: string) {
    await expect(this.page).toHaveURL('/');
    await expect(this.page.getByText(new RegExp(firstName))).toBeVisible();
    await expect(this.page.getByText('Build research by simply describing it.')).toBeVisible();
  }
}
