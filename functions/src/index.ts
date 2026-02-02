import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { chromium } from "playwright-chromium";

admin.initializeApp();

// Function 1: Scrape Leads
export const scrapeLeads = functions.https.onRequest(async (req, res: any) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    try {
        const { city, state, type, minRating = 4.0, maxResults = 50 } = req.body;

        const browser = await chromium.launch();
        const page = await browser.newPage();

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
                    await page.waitForTimeout(2000); // Wait for details to load

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

                        // Save to Firestore
                        await admin.firestore().collection('leads').add(lead);
                        results.push(lead);
                    }
                }
            } catch (err) {
                console.error("Error scraping listing", err);
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

// Function 2: Make Call (VAPI)
export const makeCall = functions.https.onRequest(async (req, res: any) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    try {
        const { leadId } = req.body;
        const leadDoc = await admin.firestore().collection('leads').doc(leadId).get();
        const lead = leadDoc.data();

        if (!lead) {
            res.status(404).json({ error: "Lead not found" });
            return;
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

// Function 3: VAPI Webhook
export const vapiWebhook = functions.https.onRequest(async (req, res: any) => {
    const { message, call } = req.body;

    if (message?.type !== 'end-of-call-report') {
        // Just acknowledge other events
        res.json({ success: true });
        return;
    }

    const leadId = call?.metadata?.leadId;

    if (!leadId) {
        res.status(400).json({ error: 'No leadId in metadata' });
        return;
    }

    // Analyze transcript
    const transcript = message?.transcript || '';
    let newStatus = 'Called';
    let outcome = 'unknown';

    if (transcript.toLowerCase().includes('interested') ||
        transcript.toLowerCase().includes('book') ||
        transcript.toLowerCase().includes('schedule')) {
        newStatus = 'Demo Booked';
        outcome = 'interested';
    } else if (call.status === 'ended' && call.endedReason === 'customer-ended-call') {
        newStatus = 'Called';
        outcome = 'completed';
    } else if (call.status === 'ended' && call.endedReason === 'no-answer') {
        newStatus = 'New Lead'; // Retry later
        outcome = 'no-answer';
    }

    // Update lead
    await admin.firestore().collection('leads').doc(leadId).update({
        status: newStatus,
        lastCallOutcome: outcome
    });

    // Update call log
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
