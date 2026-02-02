const express = require('express');
const cors = require('cors');
const db = require('./db');
const { scrapeGoogleMaps } = require('./scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.send('Apex Voice Solutions API is running 🚀');
});

// GET Leads
app.get('/leads', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST Import Leads
app.post('/leads', async (req, res) => {
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) return res.status(400).json({ error: 'Invalid data' });

    let savedCount = 0;
    for (const lead of leads) {
        try {
            await db.query(`
            INSERT INTO leads (business_name, phone, city, rating, status)
            VALUES ($1, $2, $3, $4, 'New Lead')
            ON CONFLICT (phone) DO NOTHING
        `, [lead.businessName, lead.phoneNumber || lead.phone, lead.city, lead.rating || 0]);
            savedCount++;
        } catch (e) {
            console.error('Error saving lead:', e);
        }
    }
    res.json({ success: true, count: savedCount });
});

// POST Scrape (Long running)
app.post('/scrape', async (req, res) => {
    const { city, state, type, maxResults } = req.body;
    console.log(`Starting scrape for ${type} in ${city}, ${state}...`);

    try {
        const leads = await scrapeGoogleMaps(city, state, type, maxResults || 10);

        let savedCount = 0;
        for (const lead of leads) {
            const saved = await db.query(`
                INSERT INTO leads (business_name, phone, city, rating, status)
                VALUES ($1, $2, $3, $4, 'New Lead')
                ON CONFLICT (phone) DO NOTHING
                RETURNING id
            `, [lead.businessName, lead.phone, lead.city, lead.rating || 0]);
            if (saved.rowCount > 0) savedCount++;
        }

        res.json({ success: true, found: leads.length, saved: savedCount, leads });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Scraping failed' });
    }
});

// POST VAPI Webhook
app.post('/webhooks/vapi', async (req, res) => {
    const callData = req.body.message || req.body;
    console.log('Webhook received:', callData.type);

    try {
        if (callData.type === 'end-of-call-report') {
            const { call, transcript, summary } = callData;

            if (call.customer && call.customer.number) {
                console.log(`Call completed for ${call.customer.number}: ${summary}`);
                // Future: storage logic here
            }
        }
    } catch (err) {
        console.error('Webhook error:', err);
    }

    res.json({ received: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
