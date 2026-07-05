// Dynamic booking payload generator for k6 tests
// Pure ES6, zero-dependency helper to avoid duplicate cached data during high-throughput runs

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function randomDateRange(minStartDays = 1, maxStartDays = 30, minLength = 1, maxLength = 14) {
  const startOffset = randomInt(minStartDays, maxStartDays);
  const length = randomInt(minLength, maxLength);
  const start = new Date();
  start.setDate(start.getDate() + startOffset);
  const end = new Date(start);
  end.setDate(start.getDate() + length);
  return { checkin: formatDate(start), checkout: formatDate(end) };
}

export function generateBookingPayload() {
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Sam', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const needs = ['Breakfast', 'Late checkout', 'Extra pillows', 'Airport pickup', 'None'];

  const firstname = randomFrom(firstNames);
  const lastname = randomFrom(lastNames);
  const totalprice = randomInt(50, 500);
  const depositpaid = Math.random() < 0.8; // 80% chance deposit paid
  const bookingdates = randomDateRange(1, 60, 1, 14);
  const additionalneeds = randomFrom(needs);

  return {
    firstname,
    lastname,
    totalprice,
    depositpaid,
    bookingdates,
    additionalneeds,
  };
}
