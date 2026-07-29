export type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod';

const testEnvironments: Record<TestEnvironment, string> = {
  local: 'http://localhost:5173',
  dev: 'https://dev-stg.enspeek.ai',
  staging: 'https://dev-stg.enspeek.ai',
  prod: 'https://app.enspeek.ai',
};

const isTestEnvironment = (value: string): value is TestEnvironment =>
  value in testEnvironments;

export const getTestEnvironment = (): TestEnvironment => {
  const environment = process.env.TEST_ENV;

  if (!environment) {
    return 'local';
  }

  if (!isTestEnvironment(environment)) {
    throw new Error(
      `Unknown TEST_ENV "${environment}". Use one of: ${Object.keys(testEnvironments).join(', ')}.`
    );
  }

  return environment;
};

export const getBaseURL = () => process.env.BASE_URL || testEnvironments[getTestEnvironment()];

export const isLocalEnvironment = () => getTestEnvironment() === 'local' && !process.env.BASE_URL;
