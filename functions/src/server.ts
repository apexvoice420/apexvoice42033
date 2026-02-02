import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { chromium } from 'playwright-chromium';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with credentials from env or default
// On Render, we'll need to pass the service account via env variable or rely on default google creds if possible
// For simple usage, we might need a serialized service account
if (!admin.apps.length) {
    // If FIREBASE_SERVICE_ACCOUNT is present (base64 encoded json usually best for PaaS)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        admin.initializeApp();
    }
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Scrape Leads Endpoint
app.post('/scrapeLeads', async (req: any, res: any) => {
    try {
        const { city, state, type, minRating = 4.0, maxResults = 50 } = req.body;

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        console.log(`Scraping ${type} in ${city}, ${state}...`);
        await page.goto(`https://www.google.com/maps/search/${type}+in+${city}+${state}`);
        await page.waitForSelector('[role="article"]', { timeout: 60000 });

        const results = [];
        const listings = await page.$$('[role="article"]');

        for (const listing of listings.slice(0, maxResults)) {
            try {
                const name = await listing.$eval('.fontHeadlineSmall', el => el.textContent);
                const rating = await listing.$eval('.fontBodyMedium span[role="img"]',
                    el => parseFloat(el.getAttribute('aria-label') || "0"));

                if (rating >= minRating) {
                    await listing.click();
                    await page.waitForTimeout(2000);

                    const phone = await page.$eval('[data-item-id*="phone"]',
                        el => el.textContent?.trim()).catch(() => null);

                    if (phone && name) {
                        const lead = {
                            businessName: name,
                            phone: phone,
                            city: city,
                            state: state,
                            niche: type,
                            rating: rating,
                            status: 'New Lead',
                            createdAt: admin.firestore.FieldValue.serverTimestamp()
                        };

                        await admin.firestore().collection('leads').add(lead);
                        results.push(lead);
                    }
                }
            } catch (err) {
                console.error("Listing error:", err);
                continue;
            }
        }

        await browser.close();
        res.json({ success: true, found: results.length, leads: results });
    } catch (error: any) {
        console.error("Scrape Error", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Make Call Endpoint
app.post('/makeCall', async (req: any, res: any) => {
    try {
        const { leadId } = req.body;
        const leadDoc = await admin.firestore().collection('leads').doc(leadId).get();
        const lead = leadDoc.data();

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: lead.phone,
                assistantId: process.env.VAPI_ASSISTANT_ID,
                customer: {
                    name: lead.businessName
                },
                metadata: {
                    leadId: leadId
                }
            })
        });

        const vapiData = await vapiResponse.json();

        // Log call
        await admin.firestore().collection('calls').add({
            leadId: leadId,
            vapiCallId: vapiData.id,
            status: 'initiated',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update lead status
        await admin.firestore().collection('leads').doc(leadId).update({
            status: 'Called',
            lastCalledAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, callId: vapiData.id });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// VAPI Webhook Endpoint
app.post('/vapiWebhook', async (req: any, res: any) => {
    const { message, call } = req.body;

    if (message?.type !== 'end-of-call-report') {
        return res.json({ success: true });
    }

    const leadId = call?.metadata?.leadId;
    if (!leadId) {
        return res.status(400).json({ error: 'No leadId in metadata' });
    }

    // Analyze transcript
    const transcript = message?.transcript || '';
    let newStatus = 'Called';
    let outcome = 'unknown';

    // Simple keyword matching for MVP
    if (transcript.toLowerCase().includes('interested') ||
        transcript.toLowerCase().includes('book') ||
        transcript.toLowerCase().includes('schedule')) {
        newStatus = 'Demo Booked';
        outcome = 'interested';
    } else if (call.status === 'ended' && call.endedReason === 'customer-ended-call') {
        newStatus = 'Called';
        outcome = 'completed';
    } else if (call.status === 'ended' && call.endedReason === 'no-answer') {
        newStatus = 'New Lead';
        outcome = 'no-answer';
    }

    await admin.firestore().collection('leads').doc(leadId).update({
        status: newStatus,
        lastCallOutcome: outcome
    });

    const callQuery = await admin.firestore().collection('calls')
        .where('vapiCallId', '==', call.id)
        .limit(1)
        .get();

    if (!callQuery.empty) {
        await callQuery.docs[0].ref.update({
            status: 'completed',
            duration: call.duration || 0,
            transcript: transcript,
            outcome: outcome,
            completedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    res.json({ success: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
