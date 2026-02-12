import "server-only";

// Stubbed for Vercel deployment.
// Functionality moved to Railway.

export const twilioClient = {
    messages: {
        create: async () => { console.log("Twilio disabled"); }
    }
} as any;

export const twilioPhoneNumber = "+15555555555";
