import "server-only";

// Stubbed for Vercel deployment (Frontend only)
// Backend logic has moved to Railway.

export async function addToGoogleCalendar(lead: any, startTime: Date) {
    console.log("Calendar integration disabled on frontend.", lead, startTime);
    return "mock-event-id";
}

export async function sendConfirmationSms(lead: any) {
    console.log("SMS integration disabled on frontend.", lead);
    return;
}
