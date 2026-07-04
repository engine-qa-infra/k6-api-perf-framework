import { Trend } from 'k6/metrics';
import { thresholds } from '../utils/thresholds.js';

export const BASE_URL = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com';
export const config = {
  baseUrl: BASE_URL,
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const customMetrics = {
  createUserTrend: new Trend('create_user_duration'),
  updateUserTrend: new Trend('update_user_duration'),
};

export const options = {
  thresholds: thresholds.load,
  summaryTrendStats: ['avg', 'min', 'max', 'p(95)', 'p(99)'],
  scenarios: {
    load_test: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      stages: [
        { target: 30, duration: '15s' },
        { target: 30, duration: '30s' },
        { target: 0, duration: '15s' },
      ],
      preAllocatedVUs: 10,
      maxVUs: 150,
    },
  },
  ext: {
    loadimpact: {
      projectID: __ENV.K6_PROJECT_ID || '',
    },
  },
};
