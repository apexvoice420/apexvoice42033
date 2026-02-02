import "server-only";
import { google } from 'googleapis';
import { twilioClient, twilioPhoneNumber } from './twilio';
import { Lead } from '@/types';

// Google Calendar Setup
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const googleClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const googlePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// We use the same service account for Google if permitted, or separate credentials
const jwtClient = new google.auth.JWT(
    googleClientEmail,
    undefined,
    googlePrivateKey,
    SCOPES
);

export async function addToGoogleCalendar(lead: Lead, startTime: Date) {
    try {
        await jwtClient.authorize();
        const calendar = google.calendar({ version: 'v3', auth: jwtClient });

        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min duration

        const event = {
            summary: `Demo with ${lead.businessName}`,
            description: `Phone: ${lead.phoneNumber}\nNotes: ${lead.notes}`,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
        };

        // 'primary' calendar of the service account.
        // In reality, you'd want to share a real user's calendar with this service account
        // or use OAuth2 flow. For V1, we log if it fails or use primary.
        const res = await calendar.events.insert({
            calendarId: 'primary', // Or a specific ID from env
            requestBody: event,
        });

        console.log('Event created: %s', res.data.htmlLink);
        return res.data.id;
    } catch (error) {
        console.error('Error adding to Google Calendar:', error);
        // Do not throw, receiving 'Booked' status is more important than calendar failure for now
        return null;
    }
}

export async function sendConfirmationSms(lead: Lead) {
    try {
        if (!lead.phoneNumber) return;

        await twilioClient.messages.create({
            body: `Hi, this is Apex Voice Solutions. Your demo is confirmed! We look forward to speaking with you.`,
            from: twilioPhoneNumber,
            to: lead.phoneNumber,
        });
        console.log(`SMS sent to ${lead.phoneNumber}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}
