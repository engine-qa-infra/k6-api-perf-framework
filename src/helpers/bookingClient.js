import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../config/config.js';
import { buildFullUrl } from './urlHelper.js';

function validateResponse(response, expectedStatus, expectedBodyKeys = []) {
  const checks = {
    'status is expected': response.status === expectedStatus,
    'response is json': response.headers['Content-Type'] && response.headers['Content-Type'].includes('application/json'),
  };

  if (expectedBodyKeys.length) {
    const body = response.json();
    expectedBodyKeys.forEach((key) => {
      checks[`body has ${key}`] = body && Object.prototype.hasOwnProperty.call(body, key);
    });
  }

  check(response, checks);
  return response;
}

export function authenticate(payload = { username: 'admin', password: 'password123' }, requestOptions = {}) {
  const url = buildFullUrl('/auth');
  const response = http.post(url, JSON.stringify(payload), {
    headers: DEFAULT_HEADERS,
    ...requestOptions,
  });

  validateResponse(response, 200, ['token']);

  const body = response.json();
  return body.token;
}

export function createBooking(payload, requestOptions = {}) {
  const url = buildFullUrl('/booking');
  const response = http.post(url, JSON.stringify(payload), {
    headers: DEFAULT_HEADERS,
    ...requestOptions,
  });

  validateResponse(response, 200, ['bookingid', 'booking']);
  return response.json();
}

export function updateBooking(id, payload, token, requestOptions = {}) {
  const url = buildFullUrl(`/booking/${id}`);
  const response = http.put(url, JSON.stringify(payload), {
    headers: {
      ...DEFAULT_HEADERS,
      Cookie: `token=${token}`,
    },
    ...requestOptions,
  });

  validateResponse(response, 200, ['firstname', 'lastname']);
  return response.json();
}
