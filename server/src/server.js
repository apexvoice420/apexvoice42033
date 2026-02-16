require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const { requireAdmin } = require('../middleware/adminAuth');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Public routes (no auth required)
app.get('/', (req, res) => {
    res.send('Apex Voice Solutions API is running 🚀');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        service: 'Apex Voice Solutions API'
    });
});

// Webhooks need to be public for VAPI callbacks
app.use('/api/webhooks', require('./routes/webhooks'));

// Admin-only routes (protected)
app.use('/api/scraper', requireAdmin, require('./routes/scraper'));
app.use('/api/leads', requireAdmin, require('./routes/leads'));
app.use('/api/calls', requireAdmin, require('./routes/calls'));
app.use('/api/campaigns', requireAdmin, require('./routes/campaigns'));
// app.use('/api/stats', requireAdmin, require('./routes/stats'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔐 Admin routes protected with API key`);
});
