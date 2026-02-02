import "server-only";
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
    console.warn("Twilio credentials not fully configured.");
}

export const twilioClient = twilio(accountSid, authToken);
export const twilioPhoneNumber = phoneNumber;
