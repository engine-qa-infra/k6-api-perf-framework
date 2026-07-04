// Centralized SLA/KPI threshold definitions for different profiles
export const thresholds = {
  smoke: {
    http_req_duration: ['p(95) < 1000'],
    checks: ['rate>0.95'],
  },
  load: {
    http_req_duration: ['p(95) < 500'],
    checks: ['rate>0.99'],
  },
};
