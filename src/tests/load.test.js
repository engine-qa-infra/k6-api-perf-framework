import { sleep } from 'k6';
import { options as masterOptions } from '../config/config.js';
import { authenticate, createBooking, updateBooking } from '../helpers/bookingClient.js';
import { getAuthPayload, generateBookingPayload } from '../data/payloads.js'; // FIXED: Importing our decoupled data model
import { generateReports } from '../utils/reporter.js';

export const options = masterOptions; // FIXED: Using direct master options profile from config

export default function () {
  // Dynamic Authentication via memory matching
  const authPayload = getAuthPayload();
  const token = authenticate(authPayload, {
    tags: { name: 'Auth_Token_Generation', layer: 'security' },
  });

  // FIXED: Triggering enterprise dynamic data profiles per virtual user loop
  const bookingPayload = generateBookingPayload(); 
  const bookingResponse = createBooking(bookingPayload, {
    tags: { name: 'Create_Booking', layer: 'mutation' },
  });
  const bookingId = bookingResponse.bookingid;

  // Execute conditional update tracking
  updateBooking(
    bookingId,
    {
      ...bookingPayload,
      totalprice: bookingPayload.totalprice + 1,
      additionalneeds: 'Late checkout',
    },
    token,
    {
      tags: { name: 'Update_Booking', layer: 'mutation' },
    }
  );

  sleep(1);
}
export function handleSummary(data) {
  return generateReports(data);
}