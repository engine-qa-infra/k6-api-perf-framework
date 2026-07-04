/**
 * Static Auth Credentials for Restful-Booker sandbox
 */
export function getAuthPayload() {
    return {
        username: "admin",
        password: "password123"
    };
}

/**
 * Dynamic Booking Payload Generator for Realistic VU Traffic Simulation
 */
export function generateBookingPayload() {
    const randomId = Math.floor(Math.random() * 10000);
    const randomPrice = Math.floor(Math.random() * 400) + 100; // Price between $100 and $500
    const depositDecision = Math.random() < 0.5; // Dynamically true or false

    return {
        firstname: `Guest${randomId}`,
        lastname: `Tester${randomId}`,
        totalprice: randomPrice,
        depositpaid: depositDecision,
        bookingdates: {
            checkin: "2026-08-01",
            checkout: "2026-08-10"
        },
        additionalneeds: "Late Check-in"
    };
}
