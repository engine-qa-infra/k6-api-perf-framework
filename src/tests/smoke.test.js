import http from 'k6/http';
import { sleep } from 'k6';
import { options as masterOptions } from '../config/config.js'; // Import master options
import { thresholds } from '../utils/thresholds.js';
import { buildFullUrl } from '../helpers/urlHelper.js';

export const options = {
  vus: 1,
  duration: '5s',
  thresholds: thresholds.smoke, // Explicitly override with smoke thresholds
};

export default function () {
  // FIXED: No need to pass config.baseUrl anymore. The helper reads BASE_URL automatically.
  const url = buildFullUrl('/booking'); 
  const response = http.get(url);

  console.log(`GET /booking request URL: ${url}`);
  console.log(`GET /booking response body: ${response.body}`);

  sleep(1);
}
