// Environment profile mapper for k6 executions
// Reads __ENV.TARGET_ENV and returns the matching profile

export function getEnvConfig() {
  const target = (typeof __ENV !== 'undefined' && __ENV.TARGET_ENV) ? __ENV.TARGET_ENV.toLowerCase() : 'production';

  const profiles = {
    staging: {
      name: 'staging',
      baseUrl: 'https://restful-booker-staging.herokuapp.com',
    },
    uat: {
      name: 'uat',
      baseUrl: 'https://restful-booker-uat.herokuapp.com',
    },
    production: {
      name: 'production',
      baseUrl: 'https://restful-booker.herokuapp.com',
    },
  };

  return profiles[target] || profiles.production;
}

export const envConfig = getEnvConfig();
