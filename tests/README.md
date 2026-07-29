# Playwright Test Architecture

This folder is the home for platform-level end-to-end tests.

## Structure

- `config/` keeps test runner environment settings, such as local, dev, staging, and prod URLs.
- `fixtures/` creates reusable Playwright fixtures for page objects and shared setup.
- `mocks/` or `support/` keeps API mocks and shared test helpers.
- `pages/` keeps page objects so tests describe user actions instead of selector details.
- `test-data/` keeps reusable test users and static test data.
- `*.spec.ts` files contain the actual test scenarios.

## Environment Strategy

Use `TEST_ENV` for known environments:

- `local` -> `http://localhost:5173`
- `dev` -> `https://dev-stg.enspeek.ai`
- `staging` -> `https://dev-stg.enspeek.ai`
- `prod` -> `https://app.enspeek.ai`

Use `BASE_URL` only when you need a one-off URL override.

## Commands

- `npm run test:e2e:local`
- `npm run test:e2e:dev`
- `npm run test:e2e:staging`
- `npm run test:e2e:prod`
- `npm run test:e2e:headed`
- `npm run test:e2e:ui`

By default, tests run in Chromium only. Use `npm run test:e2e:all-browsers` when cross-browser coverage is needed.
