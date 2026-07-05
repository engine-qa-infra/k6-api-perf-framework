// src/tests/booking.test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateReports } from '../utils/reporter.js';
import { thresholds } from '../utils/thresholds.js';
import { generateBookingPayload } from '../data/booking.payload.js';
import { envConfig } from '../config/env.js';

// ============================================================================
// FRAMEWORK CONFIGURATION & OPEN-LOOP WORKLOAD MODEL
// ============================================================================
export const options = {
  scenarios: {
    open_loop_crud_journey: {
      executor: 'ramping-arrival-rate',
      startRate: 5,                  // Start with 5 iterations per second
      timeUnit: '1s',                // Define rate per second
      preAllocatedVUs: 30,           // Initial pool of VUs to prevent allocation delays
      maxVUs: 300,                   // Upper concurrency limit under high load
      stages: [
        { duration: '30s', target: 20 },  // Warm-up phase: scale up to 30 req/sec
        { duration: '1m', target: 64 },  // Peak load phase: sustain target 64+ req/sec
        { duration: '30s', target: 0 },   // Cool-down phase: ramp down to 0 req/sec
      ],
    },
  },
  // Decoupled thresholds imported from utility layer
  thresholds: thresholds.load,
};

// Base URL from env profile
const BASE_URL = envConfig.baseUrl;

// ============================================================================
// LIFECYCLE: SETUP (Executed once at the beginning of the test)
// ============================================================================
export function setup() {
  const authPayload = JSON.stringify({
    username: 'admin',
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = http.post(`${BASE_URL}/auth`, authPayload, params);
  
  const isAuthSuccessful = check(response, {
    'Auth status is 200': (r) => r.status === 200,
    'Token is present': (r) => r.json('token') !== undefined,
  });

  if (!isAuthSuccessful) {
    console.error('❌ Critical Setup Failure: Authentication failed. Exiting test execution.');
    return { token: null };
  }

  return { token: response.json('token') };
}

// ============================================================================
// LIFECYCLE: VU DEFAULT FUNCTION (Executed concurrently by virtual users)
// ============================================================================
export default function (data) {
  // Gracefully handle missing token scenarios
  if (!data.token) {
    return;
  }
  // Use dynamic, randomized booking payload to avoid cache collisions
  const bookingObj = generateBookingPayload();
  const bookingPayload = JSON.stringify(bookingObj);

  const baseHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // 1) CREATE (POST /booking)
  const createRes = http.post(`${BASE_URL}/booking`, bookingPayload, { headers: baseHeaders });
  const createdId = createRes.json('bookingid') || (createRes.json() && createRes.json().bookingid);

  check(createRes, {
    'Create: status is 200': (r) => r.status === 200,
    'Create: booking id returned': () => !!createdId,
  });

  // short safety pause
  sleep(0.1);

   // 2) READ (GET /booking/{id})
  const getRes = http.get(`${BASE_URL}/booking/${createdId}`, { 
    headers: baseHeaders,
    tags: { name: '/booking/:id' } // ◄ ADD THIS TAG RULE HERE
  });
  const fetched = getRes.json();

  check(getRes, {
    'Get: status is 200': (r) => r.status === 200,
    'Get: firstname matches': (r) => fetched && fetched.firstname === bookingObj.firstname,
  });

  // 3) UPDATE (PUT /booking/{id}) - requires auth token in Cookie
  const updatedPayloadObj = Object.assign({}, bookingObj, {
    totalprice: bookingObj.totalprice + 5,
    additionalneeds: bookingObj.additionalneeds === 'Breakfast' ? 'Late checkout' : 'Breakfast',
  });
  const updatedPayload = JSON.stringify(updatedPayloadObj);

  const authHeaders = Object.assign({}, baseHeaders, { Cookie: `token=${data.token}` });
  const putRes = http.put(`${BASE_URL}/booking/${createdId}`, updatedPayload, { 
    headers: authHeaders,
    tags: { name: '/booking/:id' } // ◄ ADD THIS TAG RULE HERE
  });

  check(putRes, {
    'Update: status is 200': (r) => r.status === 200,
    'Update: totalprice updated': (r) => r.json && r.json().totalprice === updatedPayloadObj.totalprice,
  });

  // 4) DELETE (DELETE /booking/{id}) - clean up with auth
  const delRes = http.del(`${BASE_URL}/booking/${createdId}`, null, { 
    headers: { Cookie: `token=${data.token}` },
    tags: { name: '/booking/:id' } // ◄ ADD THIS TAG RULE HERE
  });

  check(delRes, {
    'Delete: status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  const success =
    createRes.status === 200 && getRes.status === 200 && putRes.status === 200 && (delRes.status === 201 || delRes.status === 200);

  check(null, { 'Overall transaction success': () => success });

  // short pause to avoid immediate retry storms
  sleep(1);
}

// ============================================================================
// LIFECYCLE: HANDLE SUMMARY (Executed once at the conclusion of the test)
// ============================================================================
export function handleSummary(data) {
  return generateReports(data);
}
